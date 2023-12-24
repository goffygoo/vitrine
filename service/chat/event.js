import { SOCKET_EVENTS, USER_TYPES } from "../../constants/index.js";
import Message from "../../model/Message.js";
import { emitToRoom } from "../../util/socketIO.js";
import config from "../../constants/config.js";
import jwt from "jsonwebtoken";
import SpaceModel from "../../model/SpaceModel.js";
import Provider from "../../model/Provider.js";
import error from "@baljeetkode/watcher/error/index.js";
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

const sendMessage = async (socket) => {
  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async ({ spaceId, message }) => {
    try {
      const { profileId, type } = socket.data;
      const Model = {
        [USER_TYPES.CONSUMER]: Consumer,
        [USER_TYPES.PROVIDER]: Provider,
      }[type];
      const user = await Model.findById(profileId).select({
        name: 1,
        profilePicture: 1,
      });
      const space = await SpaceModel.findById(spaceId).select({
        consumer: 1,
        provider: 1,
      });
      if (
        !space ||
        (!space.consumer.includes(profileId) &&
          space.provider.toString() !== profileId)
      ) {
        throw new Error();
      }
      await Message.create({
        spaceId,
        message,
        sender: profileId,
        senderType: type,
      });
	  
    } catch (e) {}
  });
};

const sendDM = (socket) => {};

const registerEvents = (socket) => {
  sendMessage(socket);
  sendDM(socket);
};

const Events = {
  registerEvents,
};

export default Events;
