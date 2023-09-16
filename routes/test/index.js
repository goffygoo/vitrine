import express from "express";
import Payment from "../../service/payment/index.js";
const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
		service: "Testing",
	});
});

router.post("/createPaymentOrder", async (_req, res) => {
	const paymentOrder = await Payment.Order.createPaymentOrder({
		amount: 8000,
		_id: "hellYeahBoyBaby",
	});
	return res.status(200).send({
		paymentOrder,
	});
});

export default router;
