import mongoose from "mongoose";

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
  titleEditorContent: {
    type: Object,
  },
  entities: {
    type: [Object],
    default: [],
  },
});

export default mongoose.model("Form", Schema);
