import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Batch } from "../entities/Batch";
import { Medicine } from "../entities/Medicine";

export const getBatches = async (_req: Request, res: Response) => {
  const batchRepo = AppDataSource.getRepository(Batch);
  const batches = await batchRepo.find();
  res.json(batches);
};

export const createBatch = async (req: Request, res: Response) => {
  try {
    const batchRepo = AppDataSource.getRepository(Batch);
    const medicineRepo = AppDataSource.getRepository(Medicine);

    const batch = batchRepo.create(req.body as Partial<Batch>);
    await batchRepo.save(batch);

    const medicine = await medicineRepo.findOneBy({ id: batch.medicineId });
    if (medicine) {
      medicine.purchasePrice = batch.purchasePrice;
      medicine.salePrice = batch.sellPrice;
      medicine.totalQuantity = (medicine.totalQuantity || 0) + batch.quantity;
      await medicineRepo.save(medicine);
    }

    res.status(201).json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur ajout lot" });
  }
};

export const updateBatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const batchRepo = AppDataSource.getRepository(Batch);
    const medicineRepo = AppDataSource.getRepository(Medicine);
    
    const batch = await batchRepo.findOneBy({ id: parseInt(id) });
    if (!batch) {
      return res.status(404).json({ message: "Lot non trouvé" });
    }
    
    const oldQuantity = batch.quantity;
    const oldMedicineId = batch.medicineId;
    
    Object.assign(batch, req.body);
    const updatedBatch = await batchRepo.save(batch);
    
    // Update medicine quantities and prices
    const medicine = await medicineRepo.findOneBy({ id: batch.medicineId });
    if (medicine) {
      const quantityDiff = batch.quantity - oldQuantity;
      medicine.purchasePrice = batch.purchasePrice;
      medicine.salePrice = batch.sellPrice;
      medicine.totalQuantity = Math.max(0, (medicine.totalQuantity || 0) + quantityDiff);
      await medicineRepo.save(medicine);
    }
    
    res.json(updatedBatch);
    
  } catch (error: any) {
    console.error("Error updating batch:", error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de la modification du lot" 
    });
  }
};

export const deleteBatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const batchRepo = AppDataSource.getRepository(Batch);
    const medicineRepo = AppDataSource.getRepository(Medicine);
    
    const batch = await batchRepo.findOneBy({ id: parseInt(id) });
    if (!batch) {
      return res.status(404).json({ message: "Lot non trouvé" });
    }
    
    const oldQuantity = batch.quantity;
    const medicineId = batch.medicineId;
    
    await batchRepo.remove(batch);
    
    // Update medicine quantity
    const medicine = await medicineRepo.findOneBy({ id: medicineId });
    if (medicine) {
      medicine.totalQuantity = Math.max(0, (medicine.totalQuantity || 0) - oldQuantity);
      await medicineRepo.save(medicine);
    }
    
    res.json({ message: "Lot supprimé avec succès" });
    
  } catch (error: any) {
    console.error("Error deleting batch:", error);
    res.status(500).json({ 
      message: error.message || "Erreur lors de la suppression du lot" 
    });
  }
};