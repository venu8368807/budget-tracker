import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  userId: string;
  categoryId: string;
  month: number; // 1-12 or 0-11? Usually 1-12 based on usage
  year: number;
  amount: number;
}

const BudgetSchema = new Schema<IBudget>({
  userId: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

export default mongoose.model<IBudget>("Budget", BudgetSchema);
