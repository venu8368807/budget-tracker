import mongoose, { Document, Schema } from "mongoose";

export interface IExpense extends Document {
  userId: string;
  categoryId: string;
  amount: number;
  date: Date;
  month: number;
  year: number;
}

const ExpenseSchema = new Schema<IExpense>({
  userId: String,
  categoryId: String,
  amount: Number,
  date: Date,
  month: Number,
  year: Number
});

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
