import express from "express";
import switchAction from "./switch.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.use("/switch", switchAction);

export default router;
