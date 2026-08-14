import { Request, Response, NextFunction } from "express";
import { Product } from "../entities/product.entity";
import { StatusCodes } from "http-status-codes";
import { addToCart, removeFromCart } from "../services/orderItem.service";
import logger from "../logger/logger";

const addToCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addToCart(req.body.cartId, req.body.productId, Number(req.params.amount));
    res.status(StatusCodes.OK).json("successfuly added product to cart");
  } catch (err: unknown) {
    next(err);
  }
};

const removeFromCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await removeFromCart(req.body.cartId, req.body.productId);
    res.status(StatusCodes.OK).json("successfuly removed product from cart");
  } catch (err: unknown) {
    next(err);
  }
};

export { addToCartHandler, removeFromCartHandler };
