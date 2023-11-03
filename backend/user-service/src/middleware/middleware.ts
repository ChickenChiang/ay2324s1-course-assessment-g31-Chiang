import admin from "../config/serviceAccount";
import { Request, Response, NextFunction } from "express";

export const decodeToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorised" });
  }
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (decodeValue) {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized" });
  } catch (e: any) {
    if (e.code === "auth/internal-error") {
      return res.status(500).json({ error: e.message });
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
};
