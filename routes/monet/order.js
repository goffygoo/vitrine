import express from "express";
import Order from "../../model/Order.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";
import Subscription from "../../model/Subscription.js";
import { ORDER_STATUS, PG_PAYMENT_STATUS } from "../../constants/index.js";
import Consumer from "../../model/Consumer.js";
import Payout from "../../model/Payout.js";
import DraftOrder from "../../model/DraftOrder.js";
import Monet from "../../service/monet/index.js";
import config from "../../constants/config.js";
import Receipt from "../../model/Receipt.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
	});
});

router.post("/createOrder", async (req, res) => {
	try {
		const { spaceId, amount } = req.body;
		const { profileId } = res.locals.data;

		const [space, receipt] = await Promise.all([
			SpaceModel.findById(spaceId).select({
				price: 1,
			}),
			Receipt.findOne({
				spaceId,
				profileId
			})
		])

		if (receipt) throw new Error('1');
		if (space.price !== amount) throw new Error('2');

		const order = await Order.create({
			profileId,
			spaceId,
			amount: +amount,
			status: ORDER_STATUS.PENDING,
		})
		const paymentOrder = await Monet.Payment.createPaymentOrder(order);
		await Order.findByIdAndUpdate(order._id, {
			pgOrderId: paymentOrder.id,
		})
		return res.send({
			pgOrderId: paymentOrder.id,
			pgKey: config.RAZORPAY_KEY_ID,
		});
	} catch (_e) {
		return res.sendStatus(400);
	}
});

router.post("/confirm", async (req, res) => {
	try {
		const { razorpayPaymentId } = req.body;
		const response = await Monet.Order.confirmPayment(razorpayPaymentId)
		return res.send(response);
	} catch (_e) {
		return res.sendStatus(400);
	}
});

router.post("/refund", async (req, res) => {
	try {
		const { paymentId } = req.body;
		const refund = await Monet.Order.refundPayment(paymentId);
		return res.send(refund);
	} catch (_e) {
		return res.sendStatus(400);
	}
});

export default router;
