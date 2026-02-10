import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Medicine } from "../entities/Medicine";
import { Batch } from "../entities/Batch";

export const getMedicines = async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Medicine);
  const medicines = await repo.find({
    relations: ['batches']
  });
  res.json(medicines);
};

export const createMedicine = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Medicine);
    
    // Validate required fields
    const { name, genericName, category, dosage, form, minStock } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        message: "Le nom commercial est obligatoire"
      });
    }
    
    // Create and save medicine
    const medicine = repo.create({
      name,
      genericName: genericName || null,
      category: category || null,
      dosage: dosage || null,
      form: form || null,
      minStock: minStock ? parseInt(minStock) : 10,
      totalQuantity: 0,
      purchasePrice: 0,
      salePrice: 0
    });
    
    const savedMedicine = await repo.save(medicine);
    res.status(201).json(savedMedicine);
    
  } catch (error: any) {
    console.error("Error creating medicine:", error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Un médicament avec ce nom existe déjà" 
      });
    }
    
    if (error.name === 'QueryFailedError') {
      return res.status(400).json({ 
        message: "Données invalides fournies",
        error: error.message
      });
    }
    
    res.status(500).json({ 
      message: error.message || "Erreur lors de l'ajout du médicament" 
    });
  }
};

export const updateMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Medicine);
    const medicine = await repo.findOneBy({ id: parseInt(id) });
    
    if (!medicine) {
      return res.status(404).json({ message: "Médicament non trouvé" });
    }
    
    Object.assign(medicine, req.body);
    const updatedMedicine = await repo.save(medicine);
    
    res.json(updatedMedicine);
    
  } catch (error: any) {
    console.error("Error updating medicine:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: "Un médicament avec ce nom existe déjà" 
      });
    }
    
    res.status(500).json({ 
      message: error.message || "Erreur lors de la modification du médicament" 
    });
  }
};

export const deleteMedicine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const medicineRepo = AppDataSource.getRepository(Medicine);
    const batchRepo = AppDataSource.getRepository(Batch);
    
    const medicine = await medicineRepo.findOneBy({ id: parseInt(id) });
    
    if (!medicine) {
      return res.status(404).json({ message: "Médicament non trouvé" });
    }
    
    // First delete all associated batches
    const batches = await batchRepo.findBy({ medicineId: parseInt(id) });
    if (batches.length > 0) {
      await batchRepo.remove(batches);
    }
    
    // Then delete the medicine
    await medicineRepo.remove(medicine);
    
    res.json({ 
      message: "Médicament et tous les lots associés supprimés avec succès",
      deletedBatches: batches.length
    });
    
  } catch (error: any) {
    console.error("Error deleting medicine:", error);
    
    // Handle foreign key constraint error
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ 
        message: "Impossible de supprimer le médicament car il possède des lots associés. Veuillez d'abord supprimer les lots." 
      });
    }
    
    res.status(500).json({ 
      message: error.message || "Erreur lors de la suppression du médicament" 
    });
  }
};