import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  tag: {
    type: Number,
    required: true,
    unique: true,
  },
  data: Object,
});

export default mongoose.model("Presentation", Schema);
