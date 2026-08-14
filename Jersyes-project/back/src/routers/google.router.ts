import express from "express";
import passport from "../services/google";
import { googleCallbackController } from "../controllers/google.controller";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallbackController
);

export default router;
