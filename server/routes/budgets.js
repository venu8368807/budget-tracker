import express from "express";
import Budget from "../models/Budget.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET budgets for a specific month/year
router.get("/", auth, async (req, res) => {
  const { month, year } = req.query;
  const list = await Budget.find({
    userId: req.user.id,
    month: Number(month),
    year: Number(year)
  });
  res.json(list);
});

// CREATE budget
router.post("/", auth, async (req, res) => {
  const data = await Budget.create({
    userId: req.user.id,
    categoryId: req.body.categoryId,
    month: req.body.month,
    year: req.body.year,
    amount: req.body.amount
  });
  res.json(data);
});

// UPDATE budget
router.put("/:id", auth, async (req, res) => {
  const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(budget);
});

// DELETE budget
router.delete("/:id", auth, async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.json({ message: "Budget deleted" });
});

export default router;
