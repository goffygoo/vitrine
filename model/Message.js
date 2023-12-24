import mongoose from "mongoose";
import { USER_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  spaceId: {
    type: ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: ObjectId,
    required: true,
  },
  senderType: {
    type: String,
    enum: [USER_TYPES.PROVIDER, USER_TYPES.CONSUMER, USER_TYPES.ADMIN],
  },
  expireAt: {
    type: Date,
    expires: "30d",
    default: Date.now,
  },
});

export default mongoose.model("Message", Schema);
