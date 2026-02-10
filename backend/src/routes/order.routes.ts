import express from "express";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/order.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/", protect, getOrders);
router.post("/", protect, createOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);
export default router;
