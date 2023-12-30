import { PaymentInstance } from "./instance.js";

const createPaymentOrder = async (order) => {
	return PaymentInstance.orders.create({
		amount: +order.amount * 100,
		currency: "INR",
		notes: {
			profileId: order.profileId,
			orderId: order._id,
		},
	});
};

const fetchPaymentOrder = async (orderId) => {
	return PaymentInstance.orders.fetch(orderId);
};

const checkPaymentStatus = async (paymentId) => {
	return PaymentInstance.payments.fetch(paymentId);
};

const refundPayment = async (paymentId) => {
	return PaymentInstance.payments.refund(paymentId)
};

const Payment = {
	createPaymentOrder,
	checkPaymentStatus,
	fetchPaymentOrder,
	refundPayment,
};

export default Payment;
