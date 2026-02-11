import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { Order } from "../entities/Order";

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Order);
    const orders = await repo.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, supplierName, ...orderData } = req.body;
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      total += item.quantity * item.unitPrice;
    }
    
    // Create order - LAISSE MYSQL GÉRER L'ID AUTOMATIQUEMENT
    const orderRepo = AppDataSource.getRepository(Order);
    
    // NE PAS spécfiier l'ID - MySQL utilisera AUTO_INCREMENT
    const order = orderRepo.create({
      ...orderData,
      orderNumber: `CMD${Date.now()}`,
      supplierName,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      items,
      total
    });
    
    await orderRepo.save(order);
    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : "Erreur lors de la création de la commande" 
    });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOneBy({ id: parseInt(id) });
    
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    
    Object.assign(order, req.body);
    await repo.save(order);
    
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la commande" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOneBy({ id: parseInt(id) });
    
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    
    await repo.remove(order);
    res.json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la commande" });
  }
};