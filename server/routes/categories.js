import express from "express";
import Category from "../models/Category.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all categories
router.get("/", auth, async (req, res) => {
  const list = await Category.find({ userId: req.user.id });
  res.json(list);
});

// CREATE category
router.post("/", auth, async (req, res) => {
  const cat = await Category.create({
    userId: req.user.id,
    name: req.body.name,
    color: req.body.color,
    limit: req.body.limit
  });
  res.json(cat);
});

// UPDATE category
router.put("/:id", auth, async (req, res) => {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(cat);
});

// DELETE category
router.delete("/:id", auth, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});

export default router;
