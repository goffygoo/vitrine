import { notifyUserImmediately } from "./actions.js";

const createLocally = (userId, endTime) => {
	const event = "subscription-ending-notification";
	const data = `subscription ending on time: ${endTime}`;
	notifyUserImmediately(userId, event, data);
};

const Subscription = {
	createLocally,
};

export default Subscription;
