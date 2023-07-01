import { SOCKET_EVENTS, SOCKET_ROOM_TAG } from "../../constants/index.js";
import Message from "../../model/Message.js";
import { emitToRoom } from "../../util/socketIO.js";

const sendMessage = (socket) => {
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async ({ classId, message }) => {
    // TODO: error handle
    const roomId = SOCKET_ROOM_TAG.CLASS + classId;
    emitToRoom(roomId, SOCKET_EVENTS.MESSAGE_RECEIVED, { message, classId });
    await Message.create({ classId, message });
  });
};
const registerEvents = (socket) => {
  sendMessage(socket);
};

const Events = {
  registerEvents,
};

export default Events;
