import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AdminPart } from "../Enums/enums";

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  adminPart: AdminPart;

  @Column({ type: "int", nullable: true })
  senderId: number | null;

  @Column({ type: "int", nullable: true })
  receiverId: number | null;
}
