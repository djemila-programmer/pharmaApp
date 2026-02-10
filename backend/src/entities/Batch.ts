import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Medicine } from "./Medicine";

@Entity()
export class Batch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  medicineId!: number;

  @ManyToOne(() => Medicine, medicine => medicine.batches)
  medicine!: Medicine;

  @Column()
  batchNumber!: string;

  @Column("datetime")
  manufacturingDate!: string;

  @Column("datetime")
  expiryDate!: string;

  @Column("float")
  purchasePrice!: number;

  @Column("float")
  sellPrice!: number;

  @Column("int")
  quantity!: number;

  @Column()
  supplierId!: number;

  @Column("datetime")
  receivedDate!: string;
}
