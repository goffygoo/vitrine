import mongoose from "mongoose";
import { FORM_TYPES } from "../constants/index.js";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  type: {
    type: String,
    enum: [FORM_TYPES.EXERCISE, FORM_TYPES.FEEDBACK, FORM_TYPES.SURVEY],
    required: true,
  },
  spaceId: {
    type: ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleEditorContent: {
    type: Object,
  },
  entities: {
    type: Object,
  },
  responses: {
    type: Object,
  }
});

export default mongoose.model("Form", Schema);
