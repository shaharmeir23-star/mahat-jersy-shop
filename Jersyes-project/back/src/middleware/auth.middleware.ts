import jwt from "jsonwebtoken";
import { customError } from "../Errors/custom.error";
import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new customError("Unauthorized", "No token provided", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    throw new customError("Unauthorized", "Invalid token", 401);
  }
};
