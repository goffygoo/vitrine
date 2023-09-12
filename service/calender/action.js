import Event from "../../model/Event.js";

const getEventsForRange = async (userId, rangeStart, rangeEnd) => {
    return Event.find({
        userId,
        startTime: {
            $gte: rangeStart,
            $lte: rangeEnd,
        },
    })
}

const getAllEvents = async (userId) => {
    return Event.find({
        userId,
    })
}

const validateLockedEventForUser = async (userId, startTime, endTime) => {
    const overlaps = await Event.countDocuments({
        userId,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
        lockSlot: true
    });

    if (overlaps > 0) throw Error("Overlaping events");
}

const addEventForUser = async (userId, type, slotType, lockSlot, parentId, startTime, endTime) => {
    if (startTime >= endTime) throw Error("Start time is greater than end time");

    if (lockSlot) await validateLockedEventForUser(userId, startTime, endTime);

    return Event.create({
        userId,
        type,
        slotType,
        lockSlot,
        parentId,
        startTime,
        endTime
    });;
}

export default {
    getAllEvents,
    getEventsForRange,
    addEventForUser
}