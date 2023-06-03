import express from "express";
import essential from "./essential.js";
import calendar from "./calendar.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.use("/essential", essential);
router.use("/calendar", calendar);

export default router;