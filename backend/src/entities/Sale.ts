import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

  @Column("simple-json")
  items!: any[];

  @Column("float")
  total!: number;

  @Column()
  paymentMethod!: string;

  @Column()
  status!: string;
}