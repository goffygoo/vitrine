import express from "express";
import Calander from "../../service/calender/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.post("/addEvent", async (req, res) => {
  const { userId, type, slotType, lockSlot, parentId, startTime, endTime } =
    req.query;
  try {
    await Calander.addEventForUser(
      userId,
      type,
      slotType,
      lockSlot,
      parentId,
      startTime,
      endTime
    );
    return res.send({ success: true });
  } catch (_e) {
    return res.sendStatus(400);
  }
});

router.get("/allEvents", async (_req, res) => {
  const { profileId } = res.locals.data;
  try {
    const events = await Calander.getAllEvents(profileId);
    return res.send({ events });
  } catch (_e) {
    return res.sendStatus(400);
  }
});

router.get("/getEventsForRange", async (req, res) => {
  const { rangeStart, rangeEnd } = req.query;
  const { profileId } = res.locals.data;
  try {
    const events = await Calander.getEventsForRange(
      profileId,
      rangeStart,
      rangeEnd
    );
    return res.send({ events });
  } catch (_e) {
    return res.sendStatus(400);
  }
});

router.get("/getUpcomingEvents", async (req, res) => {
  const { rangeStart } = req.query;
  const { profileId } = res.locals.data;
  try {
    const events = await Calander.getEventsForRangeLimit(profileId, rangeStart);
    return res.send({ events });
  } catch (_e) {
    return res.sendStatus(400);
  }
});

router.get("/getEventsForRangeSpace", async (req, res) => {
  const { rangeStart, rangeEnd, spaceId } = req.query;
  const { profileId } = res.locals.data;
  try {
    const events = await Calander.getEventsForRangeInSpace(
      profileId,
      rangeStart,
      rangeEnd,
      spaceId
    );
    return res.send({ events });
  } catch (_e) {
    return res.sendStatus(400);
  }
});

export default router;
