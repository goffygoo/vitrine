import express from "express";
import auth from "./auth/index.js";
import provider from "./provider/index.js";
import consumer from "./consumer/index.js";
import spaceRoute from "./space/index.js";
import event from "./event/index.js";
import community from "./community/index.js";
import chat from "./chat/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.use("/auth", auth);
router.use("/provider", provider);
router.use("/consumer", consumer);
router.use("/space", spaceRoute);
router.use("/event", event);
router.use("/community", community);
router.use("/chat", chat);

export default router;
