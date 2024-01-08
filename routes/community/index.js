import express from "express";
import space from "./space.js";
import user from "./user.js";
const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.use("/space", space);
router.use("/user", user);

export default router;
