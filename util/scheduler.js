import cron from "node-cron";
import Notification from "../service/notification/index.js";
import Workflow from "../service/workflow/index.js";

const scheduleSubscriptionEndNotification = () => {
  cron.schedule("0 16 * * *", Workflow.Subscription.notifySubscriptionEnding);
};

const scheduleSubscriptionDelete = () => {
  cron.schedule("5 0 * * *", Workflow.Subscription.deleteSubscription);
};

const scheduleNotificationEvents = () => {
  cron.schedule("0,30 * * * *", Notification.Handler.eventScheduler);
};

export default function initScheduler() {
  scheduleSubscriptionEndNotification();
  scheduleSubscriptionDelete();
  scheduleNotificationEvents();
}
