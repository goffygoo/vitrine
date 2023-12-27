import mongoose from "mongoose";

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
		amount: {
			type: Number,
			required: true,
		},
		transaction: {
			type: String,
			enum: ["ABORTED", "DONE", "ONGOING"],
			default: "ONGOING",
		},
		paymentOrder: {
			type: Object,
		},
		paymentDetails: {
			type: Object,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("DraftOrder", Schema);
