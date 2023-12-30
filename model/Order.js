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
			type: ObjectId,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: [
				ORDER_STATUS.PENDING,
				ORDER_STATUS.SUCCESS,
				ORDER_STATUS.REFUNDED,
				ORDER_STATUS.FAILED,
			],
			default: ORDER_STATUS.PENDING,
		},
		pgOrderId: {
			type: String,
		},
		pgPaymentId: {
			type: String,
		}
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Order", Schema);
