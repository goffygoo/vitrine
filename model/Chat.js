import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
	messages: [
		{
			type: Object,
		},
	],
	participants: [
		{
			id: ObjectId,
			userType: String,
		},
	],
	openedBy: {
		type: ObjectId,
	},
});

export default mongoose.model("Chats", Schema);
