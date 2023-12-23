import { Server } from "socket.io";
import Consumer from "../model/Consumer.js";
import Provider from "../model/Provider.js";
import { USER_TYPES } from "../constants/index.js";
import Chat from "../service/chat/index.js";
import Cache from "../service/cache/index.js";
import jwt from "jsonwebtoken";
import config from "../constants/config.js";

const { JWT_SECRET_KEY } = config;

let Singleton;

export const initConnection = (server) => {
	Singleton = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	Singleton.use(async (socket, next) => {
		const accessToken = socket.handshake.auth.accessToken;
		try {
			const data = jwt.verify(accessToken, JWT_SECRET_KEY);
			const { type, profileId } = data;

			const Model = {
				[USER_TYPES.CONSUMER]: Consumer,
				[USER_TYPES.PROVIDER]: Provider,
			}[type];
			const profile = await Model.findById(profileId).select({
				_id: 1,
			});

			if (!profile) throw Error();
			Cache.Socket.addId(profileId, socket.id);
			socket.profileId = profileId;

			return next();
		} catch (_e) {
			return next(new Error());
		}
	});

	Singleton.on("connection", (socket) => {
		socket.on("ping", () => {
			console.log("Message sent");
			emit("reply", 200);
		});

		socket.on("disconnect", () => {
			Cache.Socket.deleteId(socket.profileId, socket.id);
			console.log("disconnected")
		});

		Chat.Events.registerEvents(socket);
	});
};

export const emit = (event, data) => {
	Singleton.emit(event, data);
};

export const emitToRoom = (roomId, event, data) => {
	Singleton.to(roomId).emit(event, data);
};

export const emitToUser = (userId, event, data) => {
	Singleton.to(Cache.Socket.getIds(userId)).emit(event, data);
};