import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Sale } from "./Sale";
import { Medicine } from "./Medicine";
import { Batch } from "./Batch";

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, sale => sale.items)
  @JoinColumn({ name: "saleId" })
  sale!: Sale;

  @Column()
  saleId!: number;

  @ManyToOne(() => Medicine)
  @JoinColumn({ name: "medicineId" })
  medicine!: Medicine;

  @Column()
  medicineId!: number;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: "batchId" })
  batch!: Batch;

  @Column()
  batchId!: number;

  @Column()
  batchNumber!: string;

  @Column("int")
  quantity!: number;

  @Column("float")
  unitPrice!: number;

  @Column("float")
  total!: number;
}