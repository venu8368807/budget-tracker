import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import catRoutes from "./routes/categories.js";
import budgetRoutes from "./routes/budgets.js";
import expRoutes from "./routes/expenses.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

import requestLogger from "./middleware/logger.js";

// Middlewares
// Middlewares
app.use(cors()); // Allow Cross-Origin requests first
app.use(express.json()); // Parse JSON body
app.use(requestLogger); // Log request (now accessing parsed body is safe)

app.get("/test", (req: Request, res: Response) => { res.send("Server is working"); });

// Routes
app.use("/auth", authRoutes);
app.use("/categories", catRoutes);
app.use("/budgets", budgetRoutes);
app.use("/expenses", expRoutes);

// ✅ Start server ONLY after DB connects
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // stop app
  }
};

startServer();
