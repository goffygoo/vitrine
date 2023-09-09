import { NOTIFICATION_EVENT_TYPES } from "../../constants/index.js";
import NotificationEvent from "../../model/NotificationEvent.js";
import Call from "./call.js";

const eventScheduler = async () => {
    const min30 = 30 * 60 * 1000;
    const currentTime = Date.now() + min30;
    const endTime = currentTime + min30;
  
    const events = await NotificationEvent.find({
      startTime: {
        $lte: endTime,
        $gte: currentTime,
      },
    });
  
    const ids = events.map((event) => event._id.toString());
  
    await NotificationEvent.deleteMany({ _id: { $in: ids } });
  
    events.forEach((event) => {
        if (event.type === NOTIFICATION_EVENT_TYPES.CALL) {
            Call.createLocally(event.startTime);
        }
    });
  };

const Handler = {
    eventScheduler,
};

export default Handler;
