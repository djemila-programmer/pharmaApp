import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Sale } from "../entities/Sale";
import { Batch } from "../entities/Batch";

export const getSales = async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Sale);
    const sales = await repo.find();
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des ventes" });
  }
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const { items, ...saleData } = req.body;
    
    // Validate stock and calculate total
    const batchRepo = AppDataSource.getRepository(Batch);
    let total = 0;
    
    for (const item of items) {
      const batch = await batchRepo.findOneBy({ id: item.batchId });
      if (!batch || batch.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Stock insuffisant pour le lot ${batch?.batchNumber || item.batchId}` 
        });
      }
      
      // Deduct from batch quantity
      batch.quantity -= item.quantity;
      await batchRepo.save(batch);
      
      total += item.quantity * item.unitPrice;
    }
    
    // Create sale
    const saleRepo = AppDataSource.getRepository(Sale);
    const sale = saleRepo.create({
      ...saleData,
      date: new Date().toISOString(),
      saleNumber: `VTE${Date.now()}`,
      items,
      total
    });
    
    await saleRepo.save(sale);
    res.status(201).json(sale);
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Erreur lors de la création de la vente" 
    });
  }
};

export const updateSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Sale);
    const sale = await repo.findOneBy({ id: parseInt(id) });
    
    if (!sale) {
      return res.status(404).json({ message: "Vente non trouvée" });
    }
    
    Object.assign(sale, req.body);
    await repo.save(sale);
    res.json(sale);
  } catch (error) {
    console.error("Error updating sale:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la vente" });
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Sale);
    const sale = await repo.findOneBy({ id: parseInt(id) });
    
    if (!sale) {
      return res.status(404).json({ message: "Vente non trouvée" });
    }
    
    await repo.remove(sale);
    res.json({ message: "Vente supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la vente" });
  }
};