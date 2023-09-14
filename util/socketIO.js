import { Server } from "socket.io";
import Consumer from "../model/Consumer.js";
import Provider from "../model/Provider.js";
import { USER_TYPES, SOCKET_ROOM_TAG } from "../constants/index.js";
import Chat from "../service/chat/index.js";
import Cache from "../service/cache/index.js";

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
		const profileId = socket.handshake.auth.profileId;
		const type = socket.handshake.auth.type;
		try {
			const Model = {
				[USER_TYPES.CONSUMER]: Consumer,
				[USER_TYPES.PROVIDER]: Provider,
			}[type];
			const profile = await Model.findById(profileId).select({
				_id: 0,
				userId: 1,
				spaces: 1,
			});

			if (!profile) throw Error('User not found')

			Cache.Socket.addId(profile.userId, socket.id);
			socket.userId = profile.userId;
			profile.spaces?.forEach((spaceId) => {
				const roomId = SOCKET_ROOM_TAG.SPACE + spaceId.toString();
				socket.join(roomId);
			});
			return next();
		} catch (err) {
			console.log("error in sockets: ", err);
			return next(new Error("Invalid Connection"));
		}
	});

	io.on("connection", (socket) => {
		socket.on("ping", () => {
			console.log("Message sent");
			emit("reply", 200);
		});

		socket.on("disconnect", () => {
			Cache.Socket.deleteId(socket.userId, socket.id);
		});

		Chat.Events.registerEvents(socket);
	});
};

export const emit = (event, data) => {
	io.emit(event, data);
};

export const emitToRoom = (roomId, event, data) => {
	io.to(roomId).emit(event, data);
};

export const emitToUser = (userId, event, data) => {
	io.to(Cache.Socket.getIds(userId)).emit(event, data);
};

export default io;
