import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    required: true,
    default: 0
  }
});

export default mongoose.model("Category", CategorySchema);
