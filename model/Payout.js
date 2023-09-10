import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
	provider: {
		type: ObjectId,
		required: true,
	},
	description: [
		{
			type: String,
		},
	],
	amount: {
		type: Number,
		required: true,
	},
});

export default mongoose.model("Payouts", Schema);
