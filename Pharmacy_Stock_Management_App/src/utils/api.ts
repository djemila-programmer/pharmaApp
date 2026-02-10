import axiosClient from "./axiosClient";

// ===== AUTH =====
export const loginUser = async (username: string, password: string) => {
  const res = await axiosClient.post("/api/auth/login", {
    username,
    password,
  });
  return res.data;
};

// ===== MEDICINES =====
export const getMedicines = async () => {
  const res = await axiosClient.get("/api/medicines");
  return res.data;
};

// ===== SALES =====
export const getSales = async () => {
  const res = await axiosClient.get("/api/sales");
  return res.data;
};

// ===== ORDERS =====
export const getOrders = async () => {
  const res = await axiosClient.get("/api/orders");
  return res.data;
};

// ===== SUPPLIERS =====
export const getSuppliers = async () => {
  const res = await axiosClient.get("/api/suppliers");
  return res.data;
};

