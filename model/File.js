import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  folderId: {
    type: ObjectId,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

export default mongoose.model("File", Schema);
