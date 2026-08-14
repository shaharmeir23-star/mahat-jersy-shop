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
import { Order } from "./order.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column()
  userName: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column()
  isManager: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
