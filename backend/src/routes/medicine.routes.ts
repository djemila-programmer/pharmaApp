import express from "express";
import { getMedicines, createMedicine, updateMedicine, deleteMedicine } from "../controllers/medicine.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/", protect, getMedicines);
router.post("/", protect, createMedicine);
router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);
export default router;
