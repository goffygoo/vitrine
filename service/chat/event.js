import { SOCKET_EVENTS, SOCKET_ROOM_TAG } from "../../constants/index.js";
import Chat from "../../model/Chat.js";
import Message from "../../model/Message.js";
import { emitToRoom, emitToUser } from "../../util/socketIO.js";
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
		async ({ spaceId, message, dataToken }) => {
			// TODO: error handle
			const senderData = verifySendMessageDataToken(dataToken);
			if (!senderData) {
				// TODO: error handle
				return;
			}
			const { spaces, profilePicture, name } = senderData;
			if (!spaces?.includes(spaceId)) {
				// TODO: error handle
				return;
			}
			const roomId = SOCKET_ROOM_TAG.SPACE + spaceId;
			await Message.create({
				spaceId,
				message,
				senderName: name,
				senderProfilePicture: profilePicture,
			});
			emitToRoom(roomId, SOCKET_EVENTS.MESSAGE_RECEIVED, {
				spaceId,
				message,
				senderName: name,
				senderProfilePicture: profilePicture,
			});
		}
	);
};

const sendDM = (socket) => {
	socket.on(
		SOCKET_EVENTS.DIRECT_MESSAGE_SEND,
		async ({ chatId, sender, reciever, data, timestamp }) => {
			// TODO: error handle
			// const senderData = verifySendMessageDataToken(dataToken);
			// if (!senderData) {
			//   // TODO: error handle
			//   return;
			// }
			await Chat.findByIdAndUpdate(chatId, {
				$push: {
					messages: {
						sender,
						reciever,
						data,
						timestamp,
					},
				},
			});
			emitToUser(reciever, SOCKET_EVENTS.DIRECT_MESSAGE_RECEIVED, {
				chatId,
				sender,
				reciever,
				data,
				timestamp,
			});
		}
	);
};

const registerEvents = (socket) => {
	sendMessage(socket);
	sendDM(socket);
};

const Events = {
	registerEvents,
};

export default Events;
