export interface Jersey {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Jersey {
  amount: number;
}

export interface cart {
  id: number;
  items: CartItem[];
}

export interface loginRes {
  id: number;
  isManager: boolean;
  token: string;
  cart: cart;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
}

export type OrderStatus = "cart" | "arrived" | "sent" | "paid";

export const STATUS_PRIORITY: Record<OrderStatus, number> = {
  arrived: 0,
  sent: 1,
  paid: 2,
  cart: 3,
};

export interface OrderItem {
  id: number;
  name: string;
  amount: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  items: OrderItem[];
}

export interface localStorageUser {
  id: number;
  email: string;
  userName: string;
  isManager: boolean;
}
