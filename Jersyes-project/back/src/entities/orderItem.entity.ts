import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Order } from "./order.entity";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryColumn({ name: "order_id" })
  orderId: number;

  @PrimaryColumn({ name: "product_id" })
  productId: number;

  @Column({ type: "int", default: 1 })
  amount: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product: Product;
}
