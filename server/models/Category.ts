import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  userId: string;
  name: string;
  color: string;
  budget: number;
}

const CategorySchema = new Schema<ICategory>({
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
  budget: {
    type: Number,
    required: true,
    default: 0
  }
});

export default mongoose.model<ICategory>("Category", CategorySchema);
