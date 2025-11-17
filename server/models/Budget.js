import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
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

export default mongoose.model("Budget", BudgetSchema);
