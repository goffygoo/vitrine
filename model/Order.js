import mongoose from "mongoose";
import { ORDER_STATUS } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
	{
		profileId: {
			type: ObjectId,
			required: true,
		},
		spaceId: {
			type: String,
		},
		amount: {
			type: ObjectId,
			required: true,
		},
		status: {
			type: String,
			enum: [
				ORDER_STATUS.PENDING,
				ORDER_STATUS.FAILED,
				ORDER_STATUS.SUCCESS,
				ORDER_STATUS.REFUNDED,
			],
			required: true,
		},
		paymentDetails: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Order", Schema);
