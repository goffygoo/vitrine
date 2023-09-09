import { notifyImmediately } from "./actions.js";

const createLocally = (endTime) => {
  const event = "event-name-here";
  const data = { data: `subscription ending on:`, time: endTime };
  notifyImmediately(event, data)
}

const Subscription = {
  createLocally
};

export default Subscription;
