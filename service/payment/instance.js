import Razorpay from "razorpay";
import config from "../../constants/config.js";

export const PaymentInstance = new Razorpay({
	key_id: config.RAZORPAY_KEY_ID,
	key_secret: config.RAZORPAY_KEY_SECRET,
});
