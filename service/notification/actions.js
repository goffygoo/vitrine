import NotificationEvent from "../../model/NotificationEvent.js";
import { emit, emitToUser } from "../../util/socketIO.js";

const notifyImmediately = (event, data) => {
	emit(event, data);
};

const notifyUserImmediately = (event, data, profileId) => {
	emitToUser(userId, event, data);
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

export {
	notifyImmediately,
	createEventLocally,
	createEvent,
	notifyUserImmediately,
};
