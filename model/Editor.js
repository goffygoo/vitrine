import mongoose from "mongoose";

const Schema = new mongoose.Schema({
  content: {
    type: Object,
    required: true,
  },
});

export default mongoose.model("Editor", Schema);
