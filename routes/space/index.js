import express from "express";
import essential from "./essential.js";
import calendar from "./calendar.js";
import stream from "./stream.js";
import form from "./form.js";
import shelf from "./shelf.js";
import page from "./page.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.use("/essential", essential);
router.use("/calendar", calendar);
router.use("/stream", stream);
router.use("/form", form);
router.use("/shelf", shelf);
router.use("/page", page);

export default router;
