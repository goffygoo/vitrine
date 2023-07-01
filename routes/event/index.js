import express from "express";
import Call from "../../model/Call.js";
import Cache from "../../service/cache/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

const getAllEventsForId = async (userId) => {
  const calls = await Call.find({
    participants: { $elemMatch: { $eq: userId } },
  }).select({
    __v: 0,
  });

  const allEvents = [...calls].sort((a, b) => {
    return a.startTime < b.startTime ? -1 : 1;
  });

  return allEvents;
};

router.get("/allEvents", async (req, res) => {
  const { userId } = req.query;

  try {
    let events = [];

    if (Cache.Events.hasEvents(userId) && !Cache.Events.hasResetFlag(userId)) {
      events = Cache.Events.getEvents(userId);
    } else {
      events = await getAllEventsForId(userId);
      Cache.Events.setEvents(userId, events);
      Cache.Events.clearResetFlag(userId);
    }

    res.send(events);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      message: `Something went wrong`,
    });
  }
});

export default router;
