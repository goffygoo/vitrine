import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["POST", "EXERCISE"],
			required: true,
		},
		spaceID: {
			type: ObjectId,
			required: true,
		},
		formTitle: {
			type: String,
		},
		form: {
			type: ObjectId,
		},
		editor: {
			type: Object,
		},
		filesAttached: [
			{
				type: Object,
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Stream", Schema);
