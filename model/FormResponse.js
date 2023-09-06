import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const Schema = new mongoose.Schema({
  formId: {
    type: ObjectId,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
  entities: {
    type: Object,
  },
  
});

Schema.index({ formId: 1, userId: 1 }, { unique: true });

export default mongoose.model("FormResponse", Schema);
