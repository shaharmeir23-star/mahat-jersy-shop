import * as express from "express";
import {
  addUserHandler,
  logInUserHandler,
  getAllUsersIdHandler,
  updateProfileHandler,
  updatePasswordHandler
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router: express.Router = express.Router();
router.route("/signUp").post(addUserHandler);
router.route("/logIn").post(logInUserHandler);
router.route("/id").get(authMiddleware, getAllUsersIdHandler);
router.route("/update/:userId").put(authMiddleware, updateProfileHandler);
router.route("/update/password/:userId").put(authMiddleware, updatePasswordHandler);

export default router;
