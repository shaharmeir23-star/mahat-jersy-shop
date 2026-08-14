import { Request, Response, NextFunction } from "express";
import { Product } from "../entities/product.entity";
import { StatusCodes } from "http-status-codes";
import {
  getCart,
  submitCart,
  getUserOrders,
  changeStatus,
} from "../services/order.service";
import { ReturnOrder, returnCart } from "../Enums/enums";
import logger from "../logger/logger";

const getCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await getCart(Number(req.params.userId));
    res.status(StatusCodes.OK).json(cart);
  } catch (err: unknown) {
    next(err);
  }
};

const submitCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response: returnCart = await submitCart(
      req.body.orderId,
      req.body.newStatus,
      req.body.userId
    );

    res.status(StatusCodes.OK).json(response);
  } catch (err: unknown) {
    next(err);
  }
};

const changeStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = await changeStatus(req.body.orderId, req.body.newStatus);

    res.status(StatusCodes.OK).json(response);
  } catch (err: unknown) {
    next(err);
  }
};

const getUserOrdersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders: ReturnOrder[] = await getUserOrders(
      Number(req.params.userId)
    );

    res.status(StatusCodes.OK).json(orders);
  } catch (err: unknown) {
    next(err);
  }
};

export {
  getCartHandler,
  submitCartHandler,
  getUserOrdersHandler,
  changeStatusHandler,
};
