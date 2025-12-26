import express, { Response } from "express";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import Category from "../models/Category.js";
import auth, { AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// CREATE EXPENSE - with budget status
router.post("/", auth, async (req: AuthRequest, res: Response) => {
  const d = new Date(req.body.date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const exp = await Expense.create({
    userId: req.user.id,
    categoryId: req.body.categoryId,
    amount: req.body.amount,
    date: req.body.date,
    month,
    year
  });

  // Get all expenses for this category in this month
  const allExpenses = await Expense.find({
    userId: req.user.id,
    categoryId: req.body.categoryId,
    month,
    year
  });

  const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Get budget for this category/month
  const budget = await Budget.findOne({
    userId: req.user.id,
    categoryId: req.body.categoryId,
    month,
    year
  });

  const status = budget && totalSpent > budget.amount ? "over_budget" : "within_budget";

  res.json({
    ...exp.toObject(),
    totalSpent,
    budgetAmount: budget ? budget.amount : 0,
    status
  });
});

// GET MONTHLY EXPENSES
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  const [year, month] = (req.query.month as string).split("-");

  const list = await Expense.find({
    userId: req.user.id,
    month: Number(month),
    year: Number(year)
  });

  res.json(list);
});

// GET MONTHLY REPORT - spent, budget, remaining per category
router.get("/report/:monthYear", auth, async (req: AuthRequest, res: Response) => {
  const [year, month] = req.params.monthYear.split("-");

  // Get all categories for user
  const categories = await Category.find({ userId: req.user.id });

  // Get all expenses for this month
  const expenses = await Expense.find({
    userId: req.user.id,
    month: Number(month),
    year: Number(year)
  });

  // Get all budgets for this month
  const budgets = await Budget.find({
    userId: req.user.id,
    month: Number(month),
    year: Number(year)
  });

  // Build report
  const report = categories.map((cat) => {
    const spent = expenses
      .filter((e) => e.categoryId === cat._id.toString())
      .reduce((sum, e) => sum + e.amount, 0);

    const budget = budgets.find((b) => b.categoryId === cat._id.toString());
    const budgetAmount = budget ? budget.amount : 0;
    const remaining = budgetAmount - spent;

    return {
      categoryId: cat._id,
      categoryName: cat.name,
      categoryColor: cat.color,
      spent,
      budget: budgetAmount,
      remaining
    };
  });

  res.json(report);
});

export default router;
