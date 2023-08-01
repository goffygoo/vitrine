import mongoose from "mongoose";
import FormEntityMetaData from "./FormEntityMetaData.js";
const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  questionDescription: {
    type: ObjectId,
    required: true,
  },
  answerType: {
    type: String,
    required: true,
  },
  metaData: {
    type: FormEntityMetaData,
  },
});

export default Schema;
