import { Server } from "socket.io";
import Consumer from "../model/Consumer.js";
import Provider from "../model/Provider.js";
import { USER_TYPES, SOCKET_ROOM_TAG } from "../constants/index.js";
import chatService from "../service/chat/index.js";

const SOCKET_TOKEN = "SOCKET_TOKEN";

let io;
export const connectedSocketIds = {};
export const connectedUserIds = {};

export const initConnection = (server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.use((socket, next) => {
		next();
		// const token = socket.handshake.auth.token;
		// if (token === SOCKET_TOKEN) {
		//   next();
		// } else {
		//   next(new Error("Invalid Connection"))
		// }
	});

	io.use(async (socket, next) => {
		// TODO: error handling
		const profileId = socket.handshake.auth.profileId;
		if (connectedUserIds[profileId]) return;
		console.log("connect:", profileId);
		connectedUserIds[profileId] = socket.id;
		connectedSocketIds[socket.id] = profileId;

		const type = socket.handshake.auth.type;
		const Model = type === USER_TYPES.CONSUMER ? Consumer : Provider;
		const data = await Model.findById(profileId).select({
			_id: 0,
			spaces: 1,
		});

		data?.spaces?.forEach((spaceId) => {
			const roomId = SOCKET_ROOM_TAG.SPACE + spaceId.toString();
			socket.join(roomId);
		});

		next();
	});

	io.on("connection", (socket) => {
		socket.on("ping", () => {
			console.log("Message sent");
			emit("reply", 200);
		});

		socket.on("disconnect", () => {
			let profileId = connectedSocketIds[socket.id];
			delete connectedSocketIds[socket.id];
			delete connectedUserIds[profileId];
			console.log("disconnect:", profileId);
		});

		chatService.Events.registerEvents(socket);
	});
};

export const emit = (event, data) => {
	io.emit(event, data);
};

export const emitToRoom = (roomId, event, data) => {
	io.to(roomId).emit(event, data);
};

export const emitToUser = (userId, event, data) => {
	const socketId = connectedUserIds[userId];
	if (!socketId) return;
	io.to(socketId).emit(event, data);
};

export default io;
