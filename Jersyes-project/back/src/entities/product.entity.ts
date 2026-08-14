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
import { OrderItem } from "./orderItem.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  imageUrl: string;

  @OneToMany(() => OrderItem, (item) => item.product)
  orders: OrderItem[];
}
