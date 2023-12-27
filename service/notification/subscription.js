import Actions from "./actions.js";
const { notifyUserImmediately } = Actions;

const createLocally = (userId, endTime) => {
  const event = "subscription-ending-notification";
  const data = `subscription ending on time: ${endTime}`;
  notifyUserImmediately(userId, event, data);
};

const Subscription = {
  createLocally,
};

export default Subscription;
