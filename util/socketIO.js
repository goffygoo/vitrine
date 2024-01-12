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
      const { profileId, type } = data;

      Cache.Socket.addId(profileId, socket.id);
      socket.data.profileId = profileId;
      socket.data.type = type;

      return next();
    } catch (_e) {
      return next(new Error());
    }
  });

  Singleton.on("connection", (socket) => {
    Chat.Events.fireJoinedEvents(socket.data, socket);
    socket.on("disconnect", () => {
      Cache.Socket.deleteId(socket.data.profileId, socket.id);
      setTimeout(() => {
        if (!Cache.Socket.isOnline(socket.data.profileId))
          Chat.Events.fireLeaveEvents(socket.data);
      }, 10000);
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

export const emitToUser = (profileId, event, data) => {
  const socketIds = [...Cache.Socket.getIds(profileId)];
  if (socketIds.length !== 0) Singleton.to(socketIds).emit(event, data);
};
