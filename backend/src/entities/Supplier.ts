import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  address!: string;
}
