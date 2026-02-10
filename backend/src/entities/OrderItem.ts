import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { Medicine } from "./Medicine";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: "orderId" })
  order!: Order;

  @Column()
  orderId!: number;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: "medicineId" })
  medicine!: Medicine;

  @Column()
  medicineId!: number;

  @Column()
  medicineName!: string;

  @Column("int")
  quantity!: number;

  @Column("float")
  unitPrice!: number;

  @Column("float")
  total!: number;
}