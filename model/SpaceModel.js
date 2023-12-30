import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;
const Schema = new mongoose.Schema({
  provider: {
    type: ObjectId,
    required: true,
  },
  consumer: {
    type: [ObjectId],
    default: [],
  },
  meetAttendees: {
    type: [String],
    default: [],
  },
  streams: {
    type: [ObjectId],
    default: [],
  },
  greenBoard: {
    type: [ObjectId],
    default: [],
  },
  shelf: {
    type: [
      {
        name: {
          type: String,
        },
        files: [ObjectId],
      },
    ],
    default: [],
  },
  events: {
    type: [ObjectId],
    default: [],
  },
  price: {
    type: Number,
    default: Infinity,
  },
});

export default mongoose.model("Space", Schema);
