import NotificationEvent from "../../model/NotificationEvent.js";
import { emit, emitToUser } from "../../util/socketIO.js";
import Cache from "../cache/index.js";
import admin from 'firebase-admin';

const sendFCMNotifs = async (profileId, title, body) => {
	const tokens = Cache.FCMToken.getTokens(profileId);
	await admin.messaging().sendEachForMulticast({
		tokens,
		notification: {
			title,
			body
		},
	}).then(response => {
		for (let i = 0; i < response.responses.length; i++) {
			if (response.responses[0].error) {
				Cache.FCMToken.deleteToken(profileId, tokens[i]);
			}
		}
	}).catch(_e => {});
}
 
const notifyImmediately = (event, data) => {
	emit(event, data);
};

const notifyUserImmediately = (event, data, profileId) => {
	emitToUser(profileId, event, data);
	sendFCMNotifs(profileId, data.senderName, data.message);
};

const createEventLocally = (startTime, event, data) => {
	const timeDiff = startTime - Date.now();
	setTimeout(() => {
		notifyImmediately(event, data);
	}, timeDiff);
};

const createEvent = (startTime, type, parentId) => {
	return NotificationEvent.create({
		startTime,
		type,
		parentId,
	});
};

export default {
	notifyImmediately,
	createEventLocally,
	createEvent,
	notifyUserImmediately,
};
