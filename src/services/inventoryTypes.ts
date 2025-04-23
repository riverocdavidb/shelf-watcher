
// Common inventory types that will be shared across service files

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  item_quantity: number;
  expectedStock: number;
  costPrice: number;
  retailPrice: number;
  lastUpdated: string;
  department?: string;
  item_status?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Inactive';
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'received' | 'sold' | 'damaged' | 'stolen' | 'adjustment';
  quantity: number;
  date: string;
  employeeName: string;
}

export interface ShrinkageData {
  month: string;
  shrinkage: number;
  sales: number;
}

export interface DepartmentShrinkage {
  name: string;
  shrinkageRate: number;
  avgRate: number;
}

export interface ShrinkageReason {
  name: string;
  value: number;
}

export interface Department {
  department_id: number;
  name: string;
}

// Raw DB types for mapping
export type RawStockMovement = {
  id: string;
  item_id: string;
  quantity: number;
  type: string;
  created_at: string;
  employee_id?: string | null;
  notes?: string | null;
  inventory_items?: {
    name?: string;
  } | null;
};
