import express from "express";
import { getSales, createSale } from "../controllers/sale.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/", protect, getSales);
router.post("/", protect, createSale);
export default router;
