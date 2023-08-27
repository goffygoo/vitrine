import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
	{
		messages: [
			{
				type: Object,
				required: true,
			},
		],
		participants: {
			type: [ObjectId],
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Chats", Schema);
