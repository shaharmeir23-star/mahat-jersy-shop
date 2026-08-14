
import { Request, Response } from "express";
import { myDataSource } from "../connection/data-source";
import { User } from "../entities/user.entity";
import { getCart } from "../services/order.service";
import jwt from "jsonwebtoken";
import { googleCallBack } from "../services/google";

export const googleCallbackController = async (req: any, res: Response) => {
  const user: User = req.user;
  const params = await googleCallBack(user);

  res.redirect(`http://localhost:5173/loginSuccess?${params.toString()}`);
};
