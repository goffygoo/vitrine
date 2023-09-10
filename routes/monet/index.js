import express from "express";
import order from "./order.js";
import payout from "./payout.js";
import subscription from "./subscription.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.use("/order", order);
router.use("/payout", payout);
router.use("/subscription", subscription);

export default router;
