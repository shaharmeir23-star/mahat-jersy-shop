import { Request, Response, NextFunction } from "express";
import { User } from "../entities/user.entity";
import { addUser, logInUser, getAllUsersId, updateProfile, updatePassword} from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import logger from "../logger/logger";

const addUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await addUser(req.body);
    res.status(StatusCodes.OK).json("user added succesfully");
  } catch (err: unknown) {
    next(err);
  }
};

const logInUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userDetails = await logInUser(req.body);
    res.status(StatusCodes.OK).json(userDetails);
  } catch (err: unknown) {
    next(err);
  }
};

const getAllUsersIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const usersId: number[] = await getAllUsersId();
    res.status(StatusCodes.OK).json(usersId);
  } catch (err: unknown) {
    next(err);
  }
};


const updateProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await updateProfile(Number(req.params.userId), req.body.userName, req.body.email);
    res.status(StatusCodes.OK).json("user updated successfuly");
  } catch (err: unknown) {
    next(err);
  }
};



const updatePasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await updatePassword(Number(req.params.userId), req.body.currentPassword, req.body.newPassword);
    res.status(StatusCodes.OK).json("password updated successfuly");
  } catch (err: unknown) {
    next(err);
  }
};


export { addUserHandler, logInUserHandler, getAllUsersIdHandler, updateProfileHandler,updatePasswordHandler };
