import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { customError } from "../Errors/custom.error";
import logger from "../logger/logger";

const errorLogger = (
  err: Error | customError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`ERROR: ${err.message}, ${err.name}, `);
  next(err);
};

const errorMiddleware = (
  err: Error | customError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let status: number;
  let name: string;
  let message: string;
  if (err instanceof customError) {
    status = err.statusCode;
    name = err.name;
  } else {
    status = StatusCodes.INTERNAL_SERVER_ERROR;
    name = "Server Error";
  }

  message = err.message;
  res.status(status).send({
    errorName: name,
    errorMessage: message,
  });
};

export { errorLogger, errorMiddleware };
