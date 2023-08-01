import mongoose from "mongoose";
import FormEntity from "./Schema/FormEntity.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  classId: {
    type: ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleEditor: {
    type: ObjectId,
  },
  entities: {
    type: [FormEntity],
    default: [],
  },
});

export default mongoose.model("Form", Schema);
