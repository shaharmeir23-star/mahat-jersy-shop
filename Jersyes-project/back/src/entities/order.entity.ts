import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  OneToMany,
} from "typeorm";
import { status } from "../Enums/enums";
import { User } from "./user.entity";
import { OrderItem } from "./orderItem.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: status;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "user_id" }])
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];
}


