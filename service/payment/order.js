import config from "../../constants/config.js";
import { paymentInstance } from "./PaymentService.js";
import Razorpay from "razorpay";
import { createHmac } from "crypto";
import Consumer from "../../model/Consumer.js";

const getCustomer = async (profileId) => {
	try {
		const user = await Consumer.findById(profileId);
		if (!user) return null;
		if (user.razorpayCustomerId) return user.razorpayCustomerId;
		// create customer
		const razorpayCustomer = await paymentInstance.customers.create({
			name: user.name,
			notes: {
				consumerId: profileId,
			},
			fail_existing: 0,
		});
		await Consumer.findByIdAndUpdate(profileId, {
			razorpayCustomerId: razorpayCustomer.id,
		});
		return razorpayCustomer.id;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const createPaymentOrder = async (order) => {
	try {
		const customerId = await getCustomer(order.consumer);
		const paymentOrder = await paymentInstance.orders.create({
			amount: Number(order.amount),
			currency: "INR",
			receipt: order._id,
			notes: {
				customerId: customerId,
			},
		});
		return paymentOrder;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const fetchPaymentOrder = async (orderId) => {
	try {
		return await paymentInstance.orders.fetch(orderId);
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
		const paymentInfo = await paymentInstance.payments.fetch(paymentId);
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
