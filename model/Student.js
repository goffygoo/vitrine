import mongoose from "mongoose";
import Address from "./Schema/Address.js";
import { USER_PICTURE_DEFAULT } from "../constants/index.js";

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
  address: {
    type: Address,
  },
  classes: {
    type: [ObjectId],
    default: [],
  },
  profilePicture: {
    type: String,
    default: USER_PICTURE_DEFAULT,
  },
});

export default mongoose.model("Student", Schema);
