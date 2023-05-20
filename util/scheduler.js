import cron from "node-cron";
import Event from "../model/Event.js";
import Notif from "../service/notification/index.js";

const eventScheduler = async () => {
  const min30 = 30 * 60 * 1000;
  const currentTime = Date.now() + min30;
  const endTime = currentTime + min30;

  const events = await Event.find({
    startTime: {
      $lte: endTime,
      $gte: currentTime,
    },
  });

  const ids = events.map((event) => event._id.toString());

  await Event.deleteMany({ _id: { $in: ids } });

  events.forEach((event) => {
    Notif.Events.createEventLocally(event.startTime);
  });
};

const scheduleNotificationEvents = () => {
  cron.schedule("0,30 * * * *", eventScheduler);
};

export default function initScheduler() {
  scheduleNotificationEvents();
}
