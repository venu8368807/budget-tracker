import express, { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // check if already exists
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hash });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string);

  res.json({ token, user: { name: newUser.name, email: newUser.email } });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.json({ error: "User not found" });
    return;
  }

  const ok = await bcrypt.compare(password, user.password as string);
  if (!ok) {
    res.json({ error: "Wrong password" });
    return;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);

  res.json({ token, user: { name: user.name, email: user.email } });
});

export default router;
