import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db";
import fs from "fs";
const swaggerDocument = JSON.parse(
  fs.readFileSync("./swagger.json", "utf-8")
);


// Routes
import authRoutes from "./routes/auth.routes";
import medicineRoutes from "./routes/medicine.routes";
import batchRoutes from "./routes/batch.routes";
import saleRoutes from "./routes/sale.routes";
import supplierRoutes from "./routes/supplier.routes";
import orderRoutes from "./routes/order.routes";
import dashboardRoutes from "./routes/dashboard.routes";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Pharmacy Backend is running",
    status: "OK",
    docs: "http://localhost:5000/api-docs"
  });
});


export default app;
