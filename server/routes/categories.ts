import express, { Response } from "express";
import Category from "../models/Category.js";
import Budget from "../models/Budget.js";
import Expense from "../models/Expense.js";
import auth, { AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// GET all categories
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  const list = await Category.find({ userId: req.user.id });
  res.json(list);
});

// CREATE category
router.post("/", auth, async (req: AuthRequest, res: Response) => {
  const cat = await Category.create({
    userId: req.user.id,
    name: req.body.name,
    color: req.body.color,
    budget: req.body.budget
  });
  res.json(cat);
});

// UPDATE category
router.put("/:id", auth, async (req: AuthRequest, res: Response) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(cat);
});

// DELETE category
router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  const categoryId = req.params.id;

  // Delete the category
  await Category.findByIdAndDelete(categoryId);

  // Delete all budgets associated with this category
  await Budget.deleteMany({ categoryId: categoryId });

  // Delete all expenses associated with this category
  await Expense.deleteMany({ categoryId: categoryId });

  res.json({ message: "Category deleted" });
});

export default router;
