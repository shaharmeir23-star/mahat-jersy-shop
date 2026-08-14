import * as express from "express";
import {
  getCartHandler,
  submitCartHandler,
  getUserOrdersHandler,
  changeStatusHandler,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: express.Router = express.Router();
router.route("/cart/:userId").get(authMiddleware, getCartHandler);
router.route("/submit/cart").patch(authMiddleware, submitCartHandler);
router.route("/status").patch(authMiddleware, changeStatusHandler);
router.route("/allOrders/:userId").get(authMiddleware, getUserOrdersHandler);
export default router;
