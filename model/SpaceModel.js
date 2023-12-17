import mongoose from "mongoose";
import { ORDER_PLAN_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  displayPicture: {
    type: String,
    default: "tempuser.jpg",
  },
  coverPicture: {
    type: String,
    default: "tempcover.jpg",
  },
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
  plan: {
    type: Object,
    default: {},
  },
});

export default mongoose.model("Space", Schema);
