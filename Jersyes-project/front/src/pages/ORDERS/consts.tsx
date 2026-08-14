export type OrderStatus = "arrived" | "shipped" | "paid";

export const STATUS_PRIORITY: Record<OrderStatus, number> = {
  arrived: 0,
  shipped: 1,
  paid: 2,
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

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    status: "arrived",
    items: [
      { id: 101, name: "חולצת שיקגו בולס - מייקל ג'ורדן", amount: 1 },
      { id: 102, name: "חולצת לייקרס - קובי בראיינט", amount: 1 },
    ],
  },
  {
    id: 2,
    status: "paid",
    items: [{ id: 103, name: "חולצת ממפיס - ג'ה מוראנט", amount: 1 }],
  },
  {
    id: 3,
    status: "shipped",
    items: [{ id: 104, name: "חולצת גולדן סטייט - סטף קרי", amount: 1 }],
  },
];
