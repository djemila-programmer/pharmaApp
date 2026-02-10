export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  category: string;
  minStock: number;
  batches: Batch[];
}

export interface Batch {
  id: string;
  batchNumber: string;
  medicineId: string;
  quantity: number;
  purchasePrice: number;
  sellPrice: number;
  manufacturingDate: string;
  expiryDate: string;
  supplierId: string;
  receivedDate: string;
}

export interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  customerName?: string;
  prescriptionId?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  status: 'completed' | 'refunded';
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  batchId: string;
  batchNumber: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SupplierOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  manufacturingDate?: string;
  receivedDate?: string;
  expectedDelivery: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
}
