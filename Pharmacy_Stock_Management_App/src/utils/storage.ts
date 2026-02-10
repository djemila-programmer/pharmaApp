import axiosClient from "./axiosClient";
import { Medicine, Sale, SupplierOrder, Supplier, Batch } from "../types/pharmacy";

/* ================= MEDICINES ================= */

export const getMedicines = async (): Promise<Medicine[]> => {
  const res = await axiosClient.get("/api/medicines");
  return res.data || [];
};

export const addMedicine = async (medicine: Partial<Medicine>) => {
  return axiosClient.post("/api/medicines", medicine);
};

export const updateMedicine = async (id: string, updates: Partial<Medicine>) => {
  return axiosClient.put(`/api/medicines/${id}`, updates);
};

export const deleteMedicine = async (id: string) => {
  return axiosClient.delete(`/api/medicines/${id}`);
};

/* ================= BATCHES ================= */

export const addBatch = async (medicineId: string, batch: Partial<Batch>) => {
  return axiosClient.post(`/api/batches`, { ...batch, medicineId });
};

export const updateBatch = async (id: string, updates: Partial<Batch>) => {
  return axiosClient.put(`/api/batches/${id}`, updates);
};

export const deleteBatch = async (id: string) => {
  return axiosClient.delete(`/api/batches/${id}`);
};

/* ================= PRESCRIPTIONS ================= */

/* ================= SALES ================= */

export const getSales = async (): Promise<Sale[]> => {
  const res = await axiosClient.get("/api/sales");
  return res.data || [];
};

export const addSale = async (sale: Partial<Sale>) => {
  return axiosClient.post("/api/sales", sale);
};

export const updateSale = async (id: string, updates: Partial<Sale>) => {
  return axiosClient.put(`/api/sales/${id}`, updates);
};

export const deleteSale = async (id: string) => {
  return axiosClient.delete(`/api/sales/${id}`);
};

/* ================= ORDERS ================= */

export const getOrders = async (): Promise<SupplierOrder[]> => {
  const res = await axiosClient.get("/api/orders");
  return res.data || [];
};

export const addOrder = async (order: Partial<SupplierOrder>) => {
  return axiosClient.post("/api/orders", order);
};

export const updateOrder = async (id: string, updates: Partial<SupplierOrder>) => {
  return axiosClient.put(`/api/orders/${id}`, updates);
};

export const deleteOrder = async (id: string) => {
  return axiosClient.delete(`/api/orders/${id}`);
};

/* ================= SUPPLIERS ================= */

export const getSuppliers = async (): Promise<Supplier[]> => {
  const res = await axiosClient.get("/api/suppliers");
  return res.data || [];
};

export const addSupplier = async (supplier: Partial<Supplier>) => {
  return axiosClient.post("/api/suppliers", supplier);
};

export const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
  return axiosClient.put(`/api/suppliers/${id}`, updates);
};

export const deleteSupplier = async (id: string) => {
  return axiosClient.delete(`/api/suppliers/${id}`);
};

export async function saveSuppliers(suppliers: Supplier[]): Promise<void> {
  localStorage.setItem('suppliers', JSON.stringify(suppliers));
}