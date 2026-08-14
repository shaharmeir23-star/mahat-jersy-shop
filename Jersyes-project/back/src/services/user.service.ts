import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { User } from "../entities/user.entity";
import { customError } from "../Errors/custom.error";
import { myDataSource } from "../connection/data-source";
import { getCart } from "./order.service";
import { returnCart } from "../Enums/enums";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../logger/logger";

interface LoginResult {
  id: number;
  isManager: boolean;
  token: string;
  cart: returnCart;
}

const userRepository: Repository<User> = myDataSource.getRepository(User);

const addUser = async (user: Omit<User, "id">): Promise<void> => {
  const isUniq: boolean = await isEmailuniq(user.email);
  if (isUniq) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    await userRepository.save({
      ...user,
      password: hashedPassword,
    });
  } else {
    throw new customError("allreadyExists", "this email allready exist", 409);
  }
};

const isEmailuniq = async (email: string): Promise<boolean> => {
  const count: number = await userRepository.count({
    where: { email: email },
  });

  return count === 0;
};

const logInUser = async (user: Omit<User, "id">): Promise<LoginResult> => {
  const DBuser = await userRepository.findOne({ where: { email: user.email } });

  if (!DBuser) {
    throw new customError("notFound", "User not found", 404);
  }

  if (DBuser.userName !== user.userName) {
    throw new customError(
      "invalidUser",
      "Username does not match the email",
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(user.password, DBuser.password);
  if (!isPasswordValid) {
    throw new customError("invalidPassword", "Password is incorrect", 401);
  }

  const token = jwt.sign(
    { id: DBuser.id, email: DBuser.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
  const cart: returnCart = await getCart(DBuser.id);

  return {
    id: DBuser.id,
    isManager: DBuser.isManager,
    token: token,
    cart: cart,
  };
};

const isManager = async (userId: number): Promise<boolean> => {
  const userDetails = await userRepository.findOne({ where: { id: userId } });
  return userDetails.isManager;
};

const getAllUsersId = async (): Promise<number[]> => {
  const users = await userRepository.find({
    select: ["id"],
    where: { isManager: false },
  });
  return users.map((user) => user.id);
};

const updateProfile = async (
  userId: number,
  userName: string,
  email: string
) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new customError("notFound", "User not found", 404);
  }
  if (email && email !== user.email) {
    const isUniq = await isEmailuniq(email);
    if (!isUniq) {
      throw new customError("allreadyExists", "this email allready exist", 409);
    }
  }

  if (userName !== undefined) user.userName = userName;
  if (email !== undefined) user.email = email;

  await userRepository.save(user);
};

const updatePassword = async (
  userId: number,
  currentPass: string,
  newPassword: string
) => {
  try {
    console.log(userId);
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new customError("NOT_FOUND", `User ${userId} not found`, 404);
    }

    const isMatch = await bcrypt.compare(currentPass, user.password);

    if (!isMatch) {
      throw new customError(
        "WRONG_PASSWORD",
        "Current password is incorrect",
        401
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;

    await userRepository.save(user);
  } catch (err) {
    if (err instanceof customError) {
      throw err;
    }
    throw new customError("DB_ERROR", "Failed updating password", 500);
  }
};

export {
  addUser,
  logInUser,
  isManager,
  getAllUsersId,
  updateProfile,
  updatePassword,
};
