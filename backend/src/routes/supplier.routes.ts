import express from "express";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../controllers/supplier.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/", protect, getSuppliers);
router.post("/", protect, createSupplier);
router.put("/:id", protect, updateSupplier);
router.delete("/:id", protect, deleteSupplier);
export default router;
