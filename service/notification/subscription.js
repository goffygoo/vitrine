import { notifyUserImmediately } from "./actions.js";

const createLocally = (profileId, endTime) => {
	const event = "subscription-ending-notification";
	const data = `subscription ending on time: ${endTime}`;
	notifyUserImmediately(profileId, event, data);
};

const Subscription = {
	createLocally,
};

export default Subscription;
