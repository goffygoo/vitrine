import { SOCKET_EVENTS, USER_TYPES } from "../../constants/index.js";
import Message from "../../model/Message.js";
import SpaceModel from "../../model/SpaceModel.js";
import Provider from "../../model/Provider.js";
import Notification from "../notification/index.js";
import Consumer from "../../model/Consumer.js";
import Cache from "../cache/index.js";
import { emit, emitToUser } from "../../util/socketIO.js";

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
        title: 1,
      });
      if (
        !space ||
        (!space.consumer.includes(profileId) &&
          space.provider.toString() !== profileId)
      ) {
        // throw new Error();
      }
      const messageObj = await Message.create({
        spaceId,
        message,
        sender: profileId,
        senderType: type,
      });
      for (const consumer of space.consumer) {
        Notification.Actions.notifyUserImmediately(
          SOCKET_EVENTS.MESSAGE_RECEIVED,
          {
            senderName: user.name,
            senderProfilePicture: user.profilePicture,
            spaceTitle: space.title,
            message: messageObj,
          },
          consumer.toString()
        );
      }
      Notification.Actions.notifyUserImmediately(
        SOCKET_EVENTS.MESSAGE_RECEIVED,
        {
          senderName: user.name,
          senderProfilePicture: user.profilePicture,
          spaceTitle: space.title,
          message: messageObj,
        },
        space.provider
      );
    } catch (e) {}
  });
};

const getOnlineMembers = async (socket) => {
  socket.on(SOCKET_EVENTS.GET_ONLINE_MEMBERS, async ({ spaceId }) => {
    try {
      const space = await SpaceModel.findById(spaceId).select({
        consumer: 1,
        provider: 1,
      });
      const onlineMembers = {};
      for (const consumer of space.consumer) {
        if (Cache.Socket.isOnline(consumer.toString()))
          onlineMembers[consumer.toString()] = 1;
      }
      if (Cache.Socket.isOnline(space.provider.toString()))
        onlineMembers[space.provider.toString()] = 1;
      socket.emit(SOCKET_EVENTS.RECIEVED_ONLINE_MEMBER, {onlineMembers, spaceId});
    } catch (err) {}
  });
};

const joinChat = async ({ profileId, type }, socket) => {
  try {
    const Model = {
      [USER_TYPES.CONSUMER]: Consumer,
      [USER_TYPES.PROVIDER]: Provider,
    }[type];
    const user = await Model.findById(profileId).select({ spaces: 1 });
    const { spaces } = user;
    const userSpaces = await SpaceModel.find({ _id: { $in: spaces } }).select({
      consumer: 1,
      provider: 1,
    });
    const usersSet = new Set();
    for (const space of userSpaces) {
      for (const consumer of space.consumer) usersSet.add(consumer.toString());
      usersSet.add(space.provider.toString());
    }
    for (const uniqueProfileId of usersSet) {
      emitToUser(uniqueProfileId, SOCKET_EVENTS.JOINED_CHAT, { profileId });
    }
  } catch (error) {}
};

const leaveChat = async ({ profileId, type }) => {
  try {
    const Model = {
      [USER_TYPES.CONSUMER]: Consumer,
      [USER_TYPES.PROVIDER]: Provider,
    }[type];
    const user = await Model.findById(profileId).select({ spaces: 1 });
    const { spaces } = user;
    const userSpaces = await SpaceModel.find({ _id: { $in: spaces } }).select({
      consumer: 1,
      provider: 1,
    });
    const usersSet = new Set();
    for (const space of userSpaces) {
      for (const consumer of space.consumer) usersSet.add(consumer.toString());
      usersSet.add(space.provider.toString());
    }
    for (const uniqueProfileId of usersSet)
      emitToUser(uniqueProfileId, SOCKET_EVENTS.LEFT_CHAT, { profileId });
  } catch (error) {}
};

const registerEvents = (socket) => {
  sendMessage(socket);
  getOnlineMembers(socket);
};

const fireLeaveEvents = (params) => {
  leaveChat(params);
};
const fireJoinedEvents = (params, socket) => {
  joinChat(params, socket);
};

const Events = {
  registerEvents,
  fireLeaveEvents,
  fireJoinedEvents,
};

export default Events;
