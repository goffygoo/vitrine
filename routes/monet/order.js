import express from "express";
import Order from "../../model/Order.js";
import SpaceModel from "../../model/SpaceModel.js";
import db from "../../util/db.js";
import Subscription from "../../model/Subscription.js";
import { ORDER_PLAN_TYPES } from "../../constants/index.js";
import Consumer from "../../model/Consumer.js";
import Payout from "../../model/Payout.js";
import DraftOrder from "../../model/DraftOrder.js";
import Payment from "../../service/payment/index.js";

const router = express.Router();

router.get("/", (_req, res) => {
	return res.send({
		health: "OK",
		service: "Ordering",
	});
});

router.post("/createOrder", async (req, res) => {
	try {
		const { userId, itemType, item, amount, planDetails } = req.body;

		const Model = itemType === "SPACE" ? SpaceModel : null;
		if (!Model)
			return res.status(200).send({
				success: false,
				message: "No such item type",
			});
		const entity = Model.findById(item);
		if (!entity)
			return res.status(200).send({
				success: false,
				message: "No such item",
			});

		// TODO: Add necessary checks
		await DraftOrder.findOneAndDelete({ consumer: userId });

		// TODO: set confirmation timer
		// setTimeout(() => {
		// 	console.log("run confirmation timer");
		// }, 5000);

		// create order
		let order = await DraftOrder.create({
			consumer: userId,
			itemType,
			item,
			amount,
			planDetails,
		});

		const paymentOrder = await Payment.Order.createPaymentOrder(order);

		order = await DraftOrder.findByIdAndUpdate(order._id, {
			paymentOrder: paymentOrder,
		});

		// send order details
		return res.status(200).send({
			success: true,
			order,
			paymentDetails: paymentOrder,
		});
	} catch (err) {
		return res.status(400).send({
			success: false,
			error: err,
		});
	}
});

router.post("/cancelOrder", async (req, res) => {
	try {
		const { orderId } = req.body;

		// TODO: Add necessary checks

		// TODO: set confirmation timer
		// setTimeout(() => {
		// 	console.log("run confirmation timer");
		// }, 5000);

		await DraftOrder.findByIdAndDelete(orderId);

		return res.status(200).send({
			success: true,
		});
	} catch (err) {
		return res.status(400).send({
			success: false,
			error: err,
		});
	}
});

router.post("/getCart", async (req, res) => {
	try {
		const { userId } = req.body;

		// TODO: Add necessary checks

		// TODO: set confirmation timer
		// setTimeout(() => {
		// 	console.log("run confirmation timer");
		// }, 5000);

		const order = await DraftOrder.findOne({ consumer: userId });
		if (!order) {
			return res.status(400).send({
				success: false,
				message: "No Item in Cart",
			});
		}

		return res.status(200).send({
			success: true,
			order,
		});
	} catch (err) {
		return res.status(400).send({
			success: false,
			error: err,
		});
	}
});

const updateBillingDate = (planDetails, addOn, billingDate = null) => {
	if (planDetails === ORDER_PLAN_TYPES.BUY) return null;
	let newBillDate;
	if (!addOn) {
		newBillDate = new Date();
	} else {
		newBillDate = billingDate;
	}
	if (planDetails === ORDER_PLAN_TYPES.MONTHLY)
		newBillDate.setMonth(newBillDate.getMonth() + 1);
	else newBillDate.setFullYear(newBillDate.getFullYear() + 1);
	newBillDate.setHours(0, 0, 0, 0);
	return newBillDate;
};

router.post("/confirmPaymentTester", async (req, res) => {
	try {
		const { razorpayOrderId, razorpayPaymentId, razorpayPaymentSignature } =
			req.body;

		const paymentOrder = await Payment.Order.fetchPaymentOrder(razorpayOrderId);
		if (!paymentOrder)
			return res.status(400).send({
				success: false,
				message: "Nice try kiddo, wrong razorpayOrderId",
			});

		const order = await DraftOrder.findById(paymentOrder.receipt);
		if (!order) {
			return res.status(400).send({
				success: false,
				message: "Order not found",
			});
		}

		const paymentOrderId = order.paymentOrder.id;

		if (paymentOrderId !== razorpayOrderId) {
			return res.status(400).send({
				success: false,
				message: "Oli beta masti nahi, wrong paymentOrderId",
			});
		}

		const validatePaymentSignature = Payment.Order.verifyPaymentSignature(
			paymentOrderId,
			razorpayPaymentId,
			razorpayPaymentSignature
		);

		if (!validatePaymentSignature)
			return res.status(400).send({
				success: false,
				message: "Oli beta masti nahi, signature failed",
			});

		const paymentStatus = await Payment.Order.checkPaymentStatus(
			razorpayPaymentId
		);

		if (!paymentStatus.captured) {
			return res.status(400).send({
				success: false,
				message: "Payment not received, Please be patient",
			});
		}

		await DraftOrder.findByIdAndUpdate(order._id, {
			paymentDetails: paymentStatus,
		});

		// TODO: Add necessary checks

		return res.status(200).send({
			success: true,
			message: "Thanks for the payment Chomu, HAHA",
		});
	} catch (err) {
		return res.status(400).send({
			success: false,
			error: err,
		});
	}
});

router.post("/paymentConfirmation", async (req, res) => {
	try {
		// payment confirm
		const { razorpayOrderId, razorpayPaymentId, razorpayPaymentSignature } =
			req.body;

		const paymentOrder = await Payment.Order.fetchPaymentOrder(razorpayOrderId);
		if (!paymentOrder)
			return res.status(400).send({
				success: false,
				message: "Nice try kiddo, wrong razorpayOrderId",
			});

		const order = await DraftOrder.findById(paymentOrder.receipt);
		if (!order) {
			return res.status(400).send({
				success: false,
				message: "Order not found",
			});
		}

		const paymentOrderId = order.paymentOrder.id;

		if (paymentOrderId !== razorpayOrderId) {
			return res.status(400).send({
				success: false,
				message: "Oli beta masti nahi, wrong paymentOrderId",
			});
		}

		const validatePaymentSignature = Payment.Order.verifyPaymentSignature(
			paymentOrderId,
			razorpayPaymentId,
			razorpayPaymentSignature
		);

		if (!validatePaymentSignature)
			return res.status(400).send({
				success: false,
				message: "Oli beta masti nahi, signature failed",
			});

		const paymentStatus = await Payment.Order.checkPaymentStatus(
			razorpayPaymentId
		);

		if (!paymentStatus.captured) {
			return res.status(400).send({
				success: false,
				message: "Payment not received, Please be patient",
			});
		}

		await DraftOrder.findByIdAndUpdate(order._id, {
			paymentDetails: paymentStatus,
		});

		// subscribe, payout, consumer, draftorder, order, space

		let session = null;
		let subscription = null;

		// TODO: Add necessary checks
		// order confirmation using useragent identification
		// add to subscription model
		// add payout value to provider
		// add user to space

		db.startSession()
			.then((_session) => {
				// console.log("session started 1");
				session = _session;
				return session.startTransaction();
			})
			.then(() => {
				// check if subscription present
				// console.log("finding in subscription db 2.1");
				return Subscription.findOne({
					consumer: order.consumer,
					item: order.item,
				}).session(session);
			})
			.then((subs) => {
				// console.log("check if subscription aready bought 2.2");
				subscription = subs;
				if (subscription?.planDetails === ORDER_PLAN_TYPES.BUY) {
					throw Error("Course Already Bought");
				}
				return;
			})
			.then(() => {
				// console.log("create billingdate 2.3");
				let billingDate;
				if (subscription) {
					billingDate = updateBillingDate(
						order.planDetails,
						true,
						subscription.billingDate
					);
				} else {
					billingDate = updateBillingDate(order.planDetails, false);
				}
				return billingDate;
			})
			.then(async (billingDate) => {
				// console.log("adding in subscription 2.4");
				// if present, update
				if (subscription) {
					return Subscription.findByIdAndUpdate(subscription._id, {
						billingDate,
						amount: order.amount,
						planDetails: order.planDetails,
					}).session(session);
				}
				// else create
				return Subscription.create(
					[
						{
							consumer: order.consumer,
							itemType: order.itemType,
							item: order.item,
							startDate: new Date(),
							billingDate,
							amount: order.amount,
							planDetails: order.planDetails,
						},
					],
					{ session: session }
				);
			})
			.then(() => {
				// console.log("updating space 3");
				if (subscription) {
					return SpaceModel.findById(order.item).session(session);
				}
				return SpaceModel.findByIdAndUpdate(order.item, {
					$push: { consumer: order.consumer },
				}).session(session);
			})
			.then(async (space) => {
				// console.log("adding payout 4");
				const payout = await Payout.findOne({
					provider: space.provider,
				}).session(session);

				if (!payout) {
					await Payout.create(
						[
							{
								provider: space.provider,
								amount: order.amount,
								description: [
									`Amount: Rs ${order.amount} for order id:${order._id}`,
								],
							},
						],
						{ session: session }
					);
				} else {
					await Payout.findByIdAndUpdate(payout._id, {
						amount: payout.amount + order.amount,
						$push: {
							description: `Amount: Rs ${order.amount} for order id:${order._id}`,
						},
					}).session(session);
				}
			})
			.then(() => {
				// console.log("updating consumer 5");
				if (subscription) return;
				return Consumer.findByIdAndUpdate(order.consumer, {
					$push: { spaces: order.item },
				}).session(session);
			})
			.then(() => {
				// console.log("adding order 6.1");
				return Order.create(
					[
						{
							consumer: order.consumer,
							itemType: order.itemType,
							item: order.item,
							amount: order.amount,
							planDetails: order.planDetails,
							paymentDetails: paymentStatus,
						},
					],
					{
						session: session,
					}
				);
			})
			.then(() => {
				// console.log("deleting draftorder 6.2");
				return DraftOrder.findByIdAndDelete(order._id).session(session);
			})
			.then(() => {
				// console.log("yay, done 7");
				return session.commitTransaction();
			})
			.then(() => {
				return res.status(200).send({
					success: true,
					message: "Subscribed",
					order,
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(400).send({
					success: false,
					message: `Something went wrong`,
					err,
				});
				return session.abortTransaction();
			})
			.finally(() => {
				return session.endSession();
			});
	} catch (err) {
		return res.status(400).send({
			success: false,
			error: err,
		});
	}
});

export default router;
