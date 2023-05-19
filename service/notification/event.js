import Event from "../../model/Event.js";

const createEvent = async (startTime, type, parentId) => {
    const currentTime = 0;
    await Event.create(startTime, type, parentId);

    if (startTime);
}

const Events = {
    createEvent,
}

export default Events;