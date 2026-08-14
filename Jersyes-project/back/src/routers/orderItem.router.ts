import * as express from "express";
import {
  addToCartHandler,
  removeFromCartHandler,
} from "../controllers/orderItem.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: express.Router = express.Router();
router.route("/cart/add/:amount").post(authMiddleware, addToCartHandler);
router.route("/cart/remove").delete(authMiddleware, removeFromCartHandler);
export default router;
