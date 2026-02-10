import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
router.get("/", protect, getDashboardData);
export default router;
