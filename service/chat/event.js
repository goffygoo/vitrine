import { SOCKET_EVENTS, SOCKET_ROOM_TAG } from "../../constants/index.js";
import Message from "../../model/Message.js";
import { emitToRoom } from "../../util/socketIO.js";
import config from "../../constants/config.js";
import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY } = config;

const verifySendMessageDataToken = (dataToken) => {
  try {
    const data = jwt.verify(dataToken, JWT_SECRET_KEY);
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const sendMessage = (socket) => {
  socket.on(
    SOCKET_EVENTS.MESSAGE_SEND,
    async ({ classId, message, dataToken }) => {
      // TODO: error handle
      const senderData = verifySendMessageDataToken(dataToken);
      if (!senderData) {
        // TODO: error handle
        return;
      }
      const { classes, profilePicture, name } = senderData;
      if (!classes?.includes(classId)) {
        // TODO: error handle
        return;
      }
      const roomId = SOCKET_ROOM_TAG.CLASS + classId;
      await Message.create({
        classId,
        message,
        senderName: name,
        senderProfilePicture: profilePicture,
      });
      emitToRoom(roomId, SOCKET_EVENTS.MESSAGE_RECEIVED, {
        classId,
        message,
        senderName: name,
        senderProfilePicture: profilePicture,
      });
    }
  );
};
const registerEvents = (socket) => {
  sendMessage(socket);
};

const Events = {
  registerEvents,
};

export default Events;
