import { Request, Response, NextFunction } from "express";
import logger from "../logger/logger";

const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info(`request: ${req.url} sent from IP address ${req.ip}`);
  next();
};

export { loggerMiddleware };
