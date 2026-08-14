import * as express from "express";
import {
  getAllProductsHandler,
  addProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import multer from "multer";
const upload = multer();

const router: express.Router = express.Router();
router.route("/").get(authMiddleware, getAllProductsHandler);
router.post("/add", authMiddleware, upload.single("image"), addProductHandler);
router.route("/delete/:productId").delete(authMiddleware, deleteProductHandler);
router.route("/update/:productId").put(authMiddleware, updateProductHandler);
export default router;
