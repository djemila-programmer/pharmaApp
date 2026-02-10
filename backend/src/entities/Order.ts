import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderNumber!: string;

  @Column()
  supplierId!: number;

  @Column()
  supplierName!: string;

  @Column("date")
  date!: string;

  @Column("date")
  expectedDelivery!: string;

  @Column()
  status!: string;

  @Column("simple-json")
  items!: any[];

  @Column("float")
  total!: number;
}