import config from "../../constants/config.js";
import { PaymentInstance } from "./instance.js";
import { createHmac } from "crypto";

const createPaymentOrder = async (order) => {
	const paymentOrder = await PaymentInstance.orders.create({
		amount: +order.amount * 100,
		currency: "INR",
		receipt: order._id,
		notes: {
			profileId: order.profileId,
		},
	});
	
	return paymentOrder;
};

const fetchPaymentOrder = async (orderId) => {
	try {
		return await PaymentInstance.orders.fetch(orderId);
	} catch (err) {
		console.log(err);
		return null;
	}
};

const generateSignature = (razorpayOrderId, razorpayPaymentId, secret) => {
	const hmac = createHmac("sha256", secret);

	hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
	return hmac.digest("hex");
};

const verifyPaymentSignature = (
	razorpayOrderId,
	razorpayPaymentId,
	paymentSignature
) => {
	try {
		const generatedSignature = generateSignature(
			razorpayOrderId,
			razorpayPaymentId,
			config.RAZORPAY_KEY_SECRET
		);
		return generatedSignature === paymentSignature;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const checkPaymentStatus = async (paymentId) => {
	try {
		const paymentInfo = await PaymentInstance.payments.fetch(paymentId);
		return paymentInfo;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const Order = {
	createPaymentOrder,
	verifyPaymentSignature,
	checkPaymentStatus,
	fetchPaymentOrder,
};

export default Order;
