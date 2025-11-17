import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  userId: String,
  categoryId: String,
  amount: Number,
  date: Date,
  month: Number,   
  year: Number     
});

export default mongoose.model("Expense", ExpenseSchema);
