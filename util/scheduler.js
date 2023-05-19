import cron from 'node-cron';

const scheduleNotificationEvents = () => {
    cron.schedule("0,30 * * * *", () => {
        
    })
}

export default function initScheduler() {
    scheduleNotificationEvents();
}