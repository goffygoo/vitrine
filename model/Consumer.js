import mongoose from "mongoose";
import { COVER_PICTURE_DEFAULT, USER_PICTURE_DEFAULT } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  spaces: {
    type: [ObjectId],
    default: [],
  },
  profilePicture: {
    type: String,
    default: USER_PICTURE_DEFAULT,
  },
  coverPicture: {
    type: String,
    default: COVER_PICTURE_DEFAULT,
  },
  instagram: {
    type: String,
    default: "",
  },
  x: {
    type: String,
    default: "",
  },
  linkedIn: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
  workingHours: {
    type: String,
    default: "9 am - 5 pm",
  },
  offDays: {
    type: [String],
    default: [],
  },
  razorpayCustomerId: {
    type: String,
  },
});

export default mongoose.model("Consumer", Schema);
