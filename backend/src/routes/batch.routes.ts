import express from "express";
import { getBatches, createBatch, updateBatch, deleteBatch } from "../controllers/batch.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/", protect, getBatches);
router.post("/", protect, createBatch);
router.put("/:id", protect, updateBatch);
router.delete("/:id", protect, deleteBatch);

export default router;
