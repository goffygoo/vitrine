import mongoose from "mongoose";
import { NOTIFICATION_EVENT_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  startTime: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: [NOTIFICATION_EVENT_TYPES.CALL, NOTIFICATION_EVENT_TYPES.EXAM],
    required: true,
  },
  parentId: {
    type: ObjectId,
    required: true,
  },
});

export default mongoose.model("NotificationEvent", Schema);
