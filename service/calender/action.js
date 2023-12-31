import Call from "../../model/Call.js";
import Event from "../../model/Event.js";

const getEventsForRange = async (userId, rangeStart, rangeEnd) => {
  const events = await Event.find({
    userId,
    startTime: {
      $gte: rangeStart,
      $lte: rangeEnd,
    },
  });
  const eventsId = events.map((e) => e.parentId);
  const calls = await Call.find({ _id: { $in: eventsId } });
  calls.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  return calls;
};

const getEventsForRangeInSpace = async (
  userId,
  rangeStart,
  rangeEnd,
  spaceId
) => {
  const events = await Event.find({
    userId,
    startTime: {
      $gte: rangeStart,
      $lte: rangeEnd,
    },
  });
  const eventsId = events.map((e) => e.parentId);
  const calls = await Call.find({ _id: { $in: eventsId }, spaceId });
  calls.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });
  return calls;
};

const getEventsForRangeLimit = async (userId, rangeStart, limit = 5) => {
  const events = await Event.find({
    userId,
    startTime: {
      $gte: rangeStart,
    },
  })
    .limit(limit)
    .sort({ startTime: 1 });
  const eventsId = events.map((e) => e.parentId);
  const calls = await Call.find({ _id: { $in: eventsId } });
  calls.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  return calls;
};

const getAllEvents = async (userId) => {
  return await Event.find({
    userId,
  });
};

const validateLockedEventForUser = async (userId, startTime, endTime) => {
  const overlaps = await Event.countDocuments({
    userId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
    lockSlot: true,
  });

  if (overlaps > 0) throw Error("Overlaping events");
};

const addEventForUser = async (
  userId,
  type,
  slotType,
  lockSlot,
  parentId,
  startTime,
  endTime
) => {
  if (startTime >= endTime) throw Error("Start time is greater than end time");

  // TODO: validate lock requirement
  // if (lockSlot) await validateLockedEventForUser(userId, startTime, endTime);

  return Event.create({
    userId,
    type,
    slotType,
    lockSlot,
    parentId,
    startTime,
    endTime,
  });
};

export default {
  getAllEvents,
  getEventsForRange,
  addEventForUser,
  getEventsForRangeLimit,
  getEventsForRangeInSpace,
};
