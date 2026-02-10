import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Supplier } from "../entities/Supplier";

export const getSuppliers = async (_req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Supplier);
  res.json(await repo.find());
};

export const createSupplier = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Supplier);
  const supplier = repo.create(req.body);
  await repo.save(supplier);
  res.status(201).json(supplier);
};
export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Supplier);

    const supplier = await repo.findOneBy({ id: Number(id) });
    if (!supplier) {
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    repo.merge(supplier, req.body);
    await repo.save(supplier);

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Supplier);

    const supplier = await repo.findOneBy({ id: Number(id) });
    if (!supplier) {
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    await repo.remove(supplier);
    res.json({ message: "Fournisseur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
