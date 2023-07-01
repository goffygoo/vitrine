import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  classId: {
    type: ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    expires: "30d",
    default: Date.now,
  },
});

export default mongoose.model("Message", Schema);
