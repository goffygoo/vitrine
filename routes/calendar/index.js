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
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: `Something went wrong`,
      error,
    });
  }
});

router.get("/allEvents", async (req, res) => {
  const { userId } = req.query;
  console.log(userId);
  try {
    const events = await Calander.getAllEvents(userId);
    return res.send({ events });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: `Something went wrong`,
      error,
    });
  }
});

router.get("/getEventsForRange", async (req, res) => {
  const { rangeStart, rangeEnd } = req.body;
  const { userId } = res.locals.data;
  console.log(userId);
  try {
    const events = await Calander.getEventsForRange(
      userId,
      rangeStart,
      rangeEnd
    );
    return res.send({ events });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: `Something went wrong`,
      error,
    });
  }
});

router.get("/getEventsForRangeLimit", async (req, res) => {
  const { rangeStart } = req.body;
  const { userId } = res.locals.data;
  console.log(userId);
  try {
    const events = await Calander.getEventsForRangeLimit(userId, rangeStart);
    return res.send({ events });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: `Something went wrong`,
      error,
    });
  }
});

export default router;
