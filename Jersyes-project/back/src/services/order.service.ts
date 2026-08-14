import { DeleteResult, Repository, UpdateResult, Not } from "typeorm";
import { Order } from "../entities/order.entity";
import { returnCart } from "../Enums/enums";
import { customError } from "../Errors/custom.error";
import { myDataSource } from "../connection/data-source";
import { status, ReturnOrder } from "../Enums/enums";
import { User } from "../entities/user.entity";
import { isManager } from "./user.service";
import logger from "../logger/logger";

const orderRepository: Repository<Order> = myDataSource.getRepository(Order);

const hasActiveCart = async (userId: number): Promise<boolean> => {
  const count: number = await orderRepository.count({
    where: { user: { id: userId }, status: status.cart },
  });

  return count > 0;
};

const getCart = async (userId: number): Promise<returnCart> => {
  const hasCart = await hasActiveCart(userId);
  if (hasCart) {
    const cart: Order = await orderRepository.findOne({
      where: { user: { id: userId }, status: status.cart },
      relations: ["items", "items.product"],
    });
    const productsInCart = cart.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.imageUrl,
      amount: item.amount,
    }));
    return {
      id: cart.id,
      items: productsInCart,
    };
  }
  const newCart = orderRepository.create({
    user: { id: userId },
    status: status.cart,
  });
  const cart = await orderRepository.save(newCart);

  return {
    id: cart.id,
    items: [],
  };
};

const submitCart = async (
  orderId: number,
  newStatus: string,
  userId: number
): Promise<returnCart> => {
  const order = await orderRepository.findOne({
    where: { id: orderId, status: status.cart },
  });

  if (!order) throw new customError("noOrder", "Order not found", 404);

  order.status = status.paid;

  await orderRepository.save(order);

  return await getCart(userId);
};

const changeStatus = async (
  orderId: number,
  newStatus: string
): Promise<string> => {
  const order = await orderRepository.findOne({
    where: { id: orderId },
  });

  if (!order) throw new customError("noOrder", "Order not found", 404);

  if (newStatus === "paid") {
    order.status = status.paid;
  }

  if (newStatus === "sent") {
    order.status = status.sent;
  }

  if (newStatus === "arrived") {
    order.status = status.arrived;
  }

  await orderRepository.save(order);

  return "statuse changed saccesfuly to: " + newStatus;
};

const getUserOrders = async (userId: number): Promise<ReturnOrder[]> => {
  const isUserManager: boolean = await isManager(userId);
  let orders: Order[];
  if (!isUserManager) {
    orders = await orderRepository.find({
      where: {
        user: { id: userId },
        status: Not(status.cart),
      },
      relations: ["items", "items.product"],
    });
  } else {
    orders = await orderRepository.find({
      where: { status: Not(status.cart) },
      relations: ["items", "items.product"],
    });
  }

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    items: order.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      amount: item.amount,
    })),
  }));
};

export { getCart, submitCart, getUserOrders, changeStatus };
