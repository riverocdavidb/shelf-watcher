
import { InventoryItem, StockMovement, ShrinkageData, DepartmentShrinkage, ShrinkageReason } from './inventoryTypes';

// Mock data for fallback when database isn't available
export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Organic Apples',
    sku: 'PRD-001',
    category: 'Produce',
    item_quantity: 142,
    expectedStock: 150,
    costPrice: 0.75,
    retailPrice: 1.99,
    lastUpdated: '2023-04-18T14:30:00Z',
    department: 'Produce',
    item_status: 'In Stock'
  },
  {
    id: '2',
    name: 'Premium Coffee',
    sku: 'GRC-045',
    category: 'Beverages',
    item_quantity: 48,
    expectedStock: 50,
    costPrice: 4.50,
    retailPrice: 9.99,
    lastUpdated: '2023-04-19T09:15:00Z',
    department: 'Beverages',
    item_status: 'In Stock'
  },
  {
    id: '3',
    name: 'Wireless Earbuds',
    sku: 'ELC-102',
    category: 'Electronics',
    item_quantity: 18,
    expectedStock: 25,
    costPrice: 35.00,
    retailPrice: 79.99,
    lastUpdated: '2023-04-17T16:45:00Z',
    department: 'Electronics',
    item_status: 'Low Stock'
  },
];

export const mockStockMovements: StockMovement[] = [
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

export const shrinkageData: ShrinkageData[] = [
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

export const departmentShrinkage: DepartmentShrinkage[] = [
  { name: "Produce", shrinkageRate: 2.8, avgRate: 1.6 },
  { name: "Dairy", shrinkageRate: 0.9, avgRate: 1.2 },
  { name: "Meat", shrinkageRate: 3.2, avgRate: 2.5 },
  { name: "Bakery", shrinkageRate: 1.8, avgRate: 1.8 },
  { name: "Frozen", shrinkageRate: 0.7, avgRate: 0.9 },
  { name: "Beverages", shrinkageRate: 1.2, avgRate: 1.1 },
  { name: "Health", shrinkageRate: 4.2, avgRate: 3.5 },
  { name: "Electronics", shrinkageRate: 1.9, avgRate: 1.7 },
];

export const shrinkageReasons: ShrinkageReason[] = [
  { name: "Theft", value: 38 },
  { name: "Spoilage", value: 27 },
  { name: "Admin Error", value: 15 },
  { name: "Vendor Issue", value: 12 },
  { name: "Damage", value: 8 },
];
