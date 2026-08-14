import { myDataSource } from "../connection/data-source";
import { OrderItem } from "../entities/orderItem.entity";
import { customError } from "../Errors/custom.error";

const orderItemRepo = myDataSource.getRepository(OrderItem);

const addToCart = async (
  cartId: number,
  productId: number,
  amount: number
): Promise<void> => {
  const newItem = orderItemRepo.create({
    orderId: cartId,
    productId: productId,
    amount: amount,
  });

  await orderItemRepo.save(newItem);
};

const removeFromCart = async (
  cartId: number,
  productId: number
): Promise<void> => {
  const item = await orderItemRepo.findOne({
    where: { orderId: cartId, productId: productId },
  });

  if (!item) {
    throw new customError("notFound", "Product not found in cart", 404);
  }

  await orderItemRepo.remove(item);
};

export { addToCart, removeFromCart };
