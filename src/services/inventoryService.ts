
import { useQuery } from '@tanstack/react-query';

// Types for inventory data
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  expectedStock: number;
  costPrice: number;
  retailPrice: number;
  lastUpdated: string;
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

// Mock data service until connected to a backend
const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Organic Apples',
    sku: 'PRD-001',
    category: 'Produce',
    currentStock: 142,
    expectedStock: 150,
    costPrice: 0.75,
    retailPrice: 1.99,
    lastUpdated: '2023-04-18T14:30:00Z'
  },
  {
    id: '2',
    name: 'Premium Coffee',
    sku: 'GRC-045',
    category: 'Beverages',
    currentStock: 48,
    expectedStock: 50,
    costPrice: 4.50,
    retailPrice: 9.99,
    lastUpdated: '2023-04-19T09:15:00Z'
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    sku: 'ELC-102',
    category: 'Electronics',
    currentStock: 18,
    expectedStock: 25,
    costPrice: 35.00,
    retailPrice: 79.99,
    lastUpdated: '2023-04-17T16:45:00Z'
  },
];

const mockStockMovements: StockMovement[] = [
  {
    id: 'm1',
    itemId: '1',
    itemName: 'Organic Apples',
    type: 'received',
    quantity: 50,
    date: '2023-04-15T10:30:00Z',
    employeeName: 'John Smith'
  },
  {
    id: 'm2',
    itemId: '1',
    itemName: 'Organic Apples',
    type: 'sold',
    quantity: 42,
    date: '2023-04-16T14:20:00Z',
    employeeName: 'System'
  },
  {
    id: 'm3',
    itemId: '1',
    itemName: 'Organic Apples',
    type: 'damaged',
    quantity: 8,
    date: '2023-04-17T09:15:00Z',
    employeeName: 'Emily Johnson'
  },
];

// These match what's in TrendAnalysis.tsx but will be pulled from the API
const shrinkageData: ShrinkageData[] = [
  { month: "Jan", shrinkage: 8450, sales: 124000 },
  { month: "Feb", shrinkage: 7800, sales: 128000 },
  { month: "Mar", shrinkage: 9200, sales: 132000 },
  { month: "Apr", shrinkage: 10500, sales: 145000 },
  { month: "May", shrinkage: 11200, sales: 152000 },
  { month: "Jun", shrinkage: 9800, sales: 147000 },
  { month: "Jul", shrinkage: 8900, sales: 138000 },
  { month: "Aug", shrinkage: 9300, sales: 142000 },
  { month: "Sep", shrinkage: 10800, sales: 156000 },
  { month: "Oct", shrinkage: 12400, sales: 168000 },
  { month: "Nov", shrinkage: 11800, sales: 172000 },
  { month: "Dec", shrinkage: 14500, sales: 195000 },
];

const departmentShrinkage: DepartmentShrinkage[] = [
  { name: "Produce", shrinkageRate: 2.8, avgRate: 1.6 },
  { name: "Dairy", shrinkageRate: 0.9, avgRate: 1.2 },
  { name: "Meat", shrinkageRate: 3.2, avgRate: 2.5 },
  { name: "Bakery", shrinkageRate: 1.8, avgRate: 1.8 },
  { name: "Frozen", shrinkageRate: 0.7, avgRate: 0.9 },
  { name: "Beverages", shrinkageRate: 1.2, avgRate: 1.1 },
  { name: "Health", shrinkageRate: 4.2, avgRate: 3.5 },
  { name: "Electronics", shrinkageRate: 1.9, avgRate: 1.7 },
];

const shrinkageReasons: ShrinkageReason[] = [
  { name: "Theft", value: 38 },
  { name: "Spoilage", value: 27 },
  { name: "Admin Error", value: 15 },
  { name: "Vendor Issue", value: 12 },
  { name: "Damage", value: 8 },
];

// API mock functions - these would connect to a real backend API
const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockInventoryItems;
};

const fetchStockMovements = async (): Promise<StockMovement[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStockMovements;
};

const fetchShrinkageData = async (): Promise<ShrinkageData[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return shrinkageData;
};

const fetchDepartmentShrinkage = async (): Promise<DepartmentShrinkage[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return departmentShrinkage;
};

const fetchShrinkageReasons = async (): Promise<ShrinkageReason[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return shrinkageReasons;
};

// React Query hooks
export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventoryItems'],
    queryFn: fetchInventoryItems,
  });
};

export const useStockMovements = () => {
  return useQuery({
    queryKey: ['stockMovements'],
    queryFn: fetchStockMovements,
  });
};

export const useShrinkageData = () => {
  return useQuery({
    queryKey: ['shrinkageData'],
    queryFn: fetchShrinkageData,
  });
};

export const useDepartmentShrinkage = () => {
  return useQuery({
    queryKey: ['departmentShrinkage'],
    queryFn: fetchDepartmentShrinkage,
  });
};

export const useShrinkageReasons = () => {
  return useQuery({
    queryKey: ['shrinkageReasons'],
    queryFn: fetchShrinkageReasons,
  });
};
