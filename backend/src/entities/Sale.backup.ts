import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SaleItem } from "./SaleItem";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  saleNumber!: string;

  @Column("datetime")
  date!: string;

  @Column({ nullable: true })
  customerName?: string;

  @Column({ nullable: true })
  prescriptionId?: string;

  @OneToMany(() => SaleItem, item => item.sale)
  items!: SaleItem[];

  @Column("float")
  total!: number;

  @Column()
  paymentMethod!: 'cash' | 'card' | 'insurance';

  @Column()
  status!: 'completed' | 'refunded';
}