import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Medicine } from "../entities/Medicine";
import { Batch } from "../entities/Batch";
import { Sale } from "../entities/Sale";

export const getDashboardData = async (_req: Request, res: Response) => {
  try {
    const medicineRepo = AppDataSource.getRepository(Medicine);
    const batchRepo = AppDataSource.getRepository(Batch);
    const saleRepo = AppDataSource.getRepository(Sale);

    // Total médicaments
    const totalMedicines = await medicineRepo.count();

    // Aujourd'hui au format "YYYY-MM-DD" pour comparer avec la colonne expiryDate
    const today = new Date().toISOString().split("T")[0];

    // Lots expirés ou expirant aujourd'hui
    const expiredBatches = await batchRepo
      .createQueryBuilder("batch")
      .where("batch.expiryDate <= :today", { today })
      .getCount();

    // Total ventes
    const totalSales = await saleRepo.count();

    // Optionnel : médicaments en stock faible
    const medicines = await medicineRepo.find();
    const lowStockMedicines = medicines.filter(
      (med) => med.totalQuantity < (med.minStock || 0)
    ).length;

    res.json({
      totalMedicines,
      expiredBatches,
      totalSales,
      lowStockMedicines,
    });
  } catch (error) {
    console.error("Erreur dashboard:", error);
    res.status(500).json({ message: "Erreur récupération dashboard" });
  }
};
