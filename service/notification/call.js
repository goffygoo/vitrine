import { NOTIFICATION_EVENT_TYPES } from "../../constants/index.js";
import Actions from "./actions.js";

const { createEvent, createEventLocally, notifyImmediately } = Actions;

const createLocally = (startTime) => {
  const event = "eventNotification";
  const data = { data: `Call starting on:`, time: startTime };
  const triggerTime = startTime - 10 * 60 * 1000; // 10 min
  createEventLocally(triggerTime, event, data)
}

const addCall = async (call) => {
  const startTime = new Date(call.startTime).getTime();
  const currentTime = Date.now();
  const timeDiffInMin = (startTime - currentTime) / (1000 * 60);

  const event = "eventNotification";
  const data = { data: `Call starting on:`, time: startTime };

  // TODO: check on API (startTime > currentTime)

  if (timeDiffInMin <= 10) {
    notifyImmediately(event, data);
  } else if (timeDiffInMin <= 60) {
    const triggerTime = startTime - 10 * 60 * 1000; // 10 min
    createEventLocally(triggerTime, event, data)
  } else {
    await createEvent(
      new Date(call.startTime).getTime(),
      NOTIFICATION_EVENT_TYPES.CALL,
      call._id,
    );
  }
};

const Call = {
  addCall,
  createLocally
};

export default Call;
