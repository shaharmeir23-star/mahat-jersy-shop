import { Request, Response, NextFunction } from "express";
import { Product } from "../entities/product.entity";
import { StatusCodes } from "http-status-codes";
import {
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct
} from "../services/product.service";
import logger from "../logger/logger";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const getAllProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products: Product[] = await getAllProducts();
    res.status(StatusCodes.OK).json(products);
  } catch (err: unknown) {
    next(err);
  }
};

const addProductHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addProduct(req.body.price, req.body.name, req.file);
    res
      .status(StatusCodes.OK)
      .json("added product: " + req.body.name + " successfuly");
  } catch (err: unknown) {
    next(err);
  }
};

const updateProductHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await updateProduct(Number(req.params.productId), req.body.name, req.body.price, //req.body.imageUrl
    );
    res
      .status(StatusCodes.OK)
      .json(
        "updated product with ID: " + req.params.productId + " successfuly"
      );
  } catch (err: unknown) {
    next(err);
  }
};


const deleteProductHandler = async (
  req: MulterRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteProduct(Number(req.params.productId));
    res
      .status(StatusCodes.OK)
      .json(
        "deleted product with ID: " + req.params.productId + " successfuly"
      );
  } catch (err: unknown) {
    next(err);
  }
};














export { getAllProductsHandler, addProductHandler, deleteProductHandler, updateProductHandler };
