import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Batch } from "./Batch";

@Entity()
export class Medicine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  genericName?: string;

  @Column({ nullable: true })
  dosage?: string;

  @Column({ nullable: true })
  form?: string;

  @Column({ nullable: true })
  category?: string;

  @Column("float")
  purchasePrice!: number;

  @Column("float")
  salePrice!: number;

  @Column("int")
  totalQuantity!: number;

  @Column("int", { default: 10 })
  minStock!: number;

  @OneToMany(() => Batch, batch => batch.medicine)
  batches!: Batch[];
}
