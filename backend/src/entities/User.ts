import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true, nullable: true, length: 100 })
  username?: string;

  @Column({ unique: true, length: 191 })
  email!: string;


  @Column()
  password!: string;

  @Column({ default: "pharmacist" })
  role!: "admin" | "pharmacist" | "cashier";
}
