import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  classId: {
    type: ObjectId,
    required: true,
  },
  description: {
    type: String,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  googleMeet: {
    type: String,
  },
  participants: {
    type: [ObjectId],
    required: true
  }
});

export default mongoose.model("Call", Schema);
