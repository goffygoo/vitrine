import mongoose from "mongoose";
import { USER_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  googleAuth: {
    type: String,
  },
  password: {
    type: String,
  },
  type: {
    type: String,
    enum: [USER_TYPES.PROVIDER, USER_TYPES.CONSUMER, USER_TYPES.ADMIN],
  },
  profileId: {
    type: ObjectId,
  },
  refreshToken: {
    type: String,
  },
  tokenEAT: {
    type: Number,
  },
});

export default mongoose.model("User", Schema);
