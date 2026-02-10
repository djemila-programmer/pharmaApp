import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.ts"],
  connectorPackage: "mysql2"
});

const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ MySQL connected");
  } catch (error) {
    console.error("❌ DB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
