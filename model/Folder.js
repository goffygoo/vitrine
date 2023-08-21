import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
	spaceId: {
		type: ObjectId,
		required: true,
	},
	folderName: {
		type: String,
		required: true,
	},
});

export default mongoose.model("Folder", Schema);
