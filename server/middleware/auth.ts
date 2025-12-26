import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: any; // Should be typed better if possible, e.g. { id: string }
}

export default function (req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.json({ error: "No token" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user;
    next();
  } catch {
    res.json({ error: "Invalid token" });
  }
}
