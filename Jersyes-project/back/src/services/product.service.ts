import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Product } from "../entities/product.entity";
import { customError } from "../Errors/custom.error";
import { myDataSource } from "../connection/data-source";
import logger from "../logger/logger";

const productRepository: Repository<Product> =
  myDataSource.getRepository(Product);

const defaultURL =
  "https://jersy-shop-bucket14.s3.eu-north-1.amazonaws.com/0-NBA.png";

const getAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await productRepository.find();

    if (!products || products.length === 0) {
      throw new customError("notFound", "No products found", 404);
    }

    return products;
  } catch (err) {
    throw new customError("DBError", "Failed to fetch products from DB", 500);
  }
};

const addProduct = async (price: number, name: string, file?) => {
  try {
    const product = await productRepository.save({
      name,
      price,
      imageUrl: defaultURL,
    });

    let imageUrl = product.imageUrl;

    if (file) {
      imageUrl = await apploudImage(file, product.id);

      product.imageUrl = imageUrl;
      await productRepository.save(product);
    }

    return product;
  } catch (err) {
    throw new customError(
      "DBError",
      "Failed to put new product in the DB",
      500,
    );
  }
};

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const apploudImage = async (file, productId: number) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
  });

  const fileName = productId.toString() + "-" + file.originalname;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  logger.info("File buffer length: " + (file.buffer?.length || 0));
  logger.info("File name: " + file.originalname);
  logger.info("File type: " + file.mimetype);

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
  } catch (err) {
    logger.error("S3 upload failed:", err);
    throw err;
  }

  return "https://jersy-shop-bucket14.s3.eu-north-1.amazonaws.com/" + fileName;
};

const deleteProduct = async (productId: number) => {
  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    throw new customError("NOT FOUND", `no product with id ${productId}`, 404);
  }

  // מחיקה מה-S3 אם יש תמונה
  if (product.imageUrl && product.imageUrl !== defaultURL) {
    const key = product.imageUrl.split("/").pop();
    await deleteFromS3(key);
  }

  await productRepository.remove(product);
};

export const deleteFromS3 = async (key: string) => {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
  });

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };

  await s3.send(new DeleteObjectCommand(params));
};

const updateProduct = async (
  productId: number,
  name: string,
  price: number,
  imageUrl?: string,
) => {
  try {
    const existing = await productRepository.findOneBy({ id: productId });
    if (!existing) {
      throw new customError(
        "NOT FOUND",
        `no product with id ${productId}`,
        404,
      );
    }

    const updated = imageUrl
      ? productRepository.merge(existing, {
          name,
          price,
          imageUrl,
        })
      : productRepository.merge(existing, {
          name,
          price,
        });

    await productRepository.save(updated);
  } catch (err) {
    console.error(err);
    throw new customError("DBError", "Failed to update product in the DB", 500);
  }
};

export { getAllProducts, addProduct, deleteProduct, updateProduct };
