import mongoose from "mongoose";
import { ORDER_PLAN_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
	{
		consumer: {
			type: ObjectId,
			required: true,
		},
		itemType: {
			type: String,
			enum: ["SPACE"],
			required: true,
		},
		description: {
			type: String,
		},
		item: {
			type: ObjectId,
			required: true,
		},
		planDetails: {
			type: String,
			enum: [
				ORDER_PLAN_TYPES.MONTHLY,
				ORDER_PLAN_TYPES.BUY,
				ORDER_PLAN_TYPES.YEARLY,
			],
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		transaction: {
			type: String,
			enum: ["ABORTED", "DONE", "ONGOING"],
			default: "ONGOING",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("DraftOrder", Schema);
