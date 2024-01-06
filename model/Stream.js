import mongoose from "mongoose";
import { STREAM_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        STREAM_TYPES.VIDEO,
        STREAM_TYPES.EDITOR,
        STREAM_TYPES.FILE,
        STREAM_TYPES.POLL,
        STREAM_TYPES.IMAGE,
      ],
      required: true,
    },
    spaceId: {
      type: ObjectId,
      required: true,
    },
    editor: {
      type: Object,
    },
    file: {
      type: Object,
    },
    poll: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Stream", Schema);
