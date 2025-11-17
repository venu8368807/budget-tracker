import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import catRoutes from "./routes/categories.js";
import budgetRoutes from "./routes/budgets.js";
import expRoutes from "./routes/expenses.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);
app.use("/categories", catRoutes);
app.use("/budgets", budgetRoutes);
app.use("/expenses", expRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server running on", process.env.PORT)
);

