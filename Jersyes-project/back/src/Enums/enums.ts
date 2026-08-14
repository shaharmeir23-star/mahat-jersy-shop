import { Product } from "../entities/product.entity";
export enum status {
  cart = "cart",
  paid = "paid",
  sent = "sent",
  arrived = "arrived",
}

export enum AdminPart {
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface returnCart {
  id: number;
  items: (Omit<Product, "orders"> & { amount: number })[];
}

type ReturnOrderItem = {
  id: number;
  name: string;
  amount: number;
};

export type ReturnOrder = {
  id: number;
  status: string;
  items: ReturnOrderItem[];
};
