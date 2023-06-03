import Event from "../../model/Event.js";
import { emit } from "../../util/socketIO.js";
import { EVENT_TYPES } from "../../constants/index.js";

const createEvent = async (call) => {
  await Event.create({
    startTime: new Date(call.startTime).getTime(),
    type: EVENT_TYPES.CALL,
    parentId: call.classId,
  });
};

const createEventLocally = (startTime) => {
  const currentTime = Date.now();

  const timeDiff = startTime - currentTime - 10 * 60 * 1000; // 10 min
  setTimeout(() => {
    notifyImmediately(startTime);
  }, timeDiff);
};

const notifyImmediately = (startTime) => {
  emit("eventNotification", { data: `Call starting on:`, time: startTime });
};

const handleEvent = async (call) => {
  const startTime = new Date(call.startTime).getTime();
  const currentTime = Date.now();
  const timeDiffInMin = (startTime - currentTime) / (1000 * 60);

  // TODO: check on API (startTime > currentTime)

  if (timeDiffInMin <= 10) {
    notifyImmediately(startTime);
  } else if (timeDiffInMin <= 60) {
    createEventLocally(startTime);
  } else {
    await createEvent(call);
  }
};

const Events = {
  handleEvent,
  createEventLocally,
};

export default Events;
