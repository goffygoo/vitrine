import express from "express";
import auth from "./auth/index.js";
import provider from "./provider/index.js";
import consumer from "./consumer/index.js";
import space from "./space/index.js";
import calendar from "./calendar/index.js";
import community from "./community/index.js";
import chat from "./chat/index.js";
import platform from "./platform/index.js";
import admin from "./admin/index.js";
import monet from "./monet/index.js";
import test from "./test/index.js";
import integration from './integrations/index.js'
import { verifyAccessToken } from "./middleware.js";

const router = express.Router();

router.get("/", (_req, res) => {
  return res.send({
    health: "OK",
  });
});

router.use("/auth", auth);
router.use("/provider", verifyAccessToken, provider);
router.use("/consumer", consumer);
router.use("/space", verifyAccessToken, space);
router.use("/calendar", verifyAccessToken,calendar);
router.use("/community", community);
router.use("/chat", chat);
router.use("/platform", platform);
router.use("/admin", admin);
router.use("/monet", monet);
router.use("/integration", integration);
router.use("/test", test);

export default router;
