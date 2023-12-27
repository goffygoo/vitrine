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
		startDate: {
			type: Date,
			required: true,
		},
		billingDate: {
			type: Date,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Subscriptions", Schema);
