import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Types for inventory data
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

// API service functions that interact with Supabase
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  console.log('Fetching inventory items from database...');
  // Try to get data from Supabase with detailed error logging
  const { data: supabaseData, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name', { ascending: true })
    .neq('item_status', 'Inactive');  // Exclude inactive items

  if (error) {
    console.error('Error fetching from Supabase:', error);
    // Fall back to mock data if database fetch fails
    return mockInventoryItems.filter(item => item.item_status !== 'Inactive');
  }

  // Transform Supabase data to match InventoryItem interface
  if (supabaseData && supabaseData.length > 0) {
    console.log(`Successfully fetched ${supabaseData.length} inventory items from database`);
    return supabaseData
      .filter(item => item.item_status !== 'Inactive')
      .map(item => ({
        id: item.id,
        name: item.name || 'Unnamed Item',
        sku: item.sku || '',
        category: item.department || '', // Usamos department como category
        item_quantity: item.item_quantity || 0,
        expectedStock: item.expected_stock || item.item_quantity || 0,
        costPrice: item.cost_price || 0,
        retailPrice: item.retail_price || 0,
        lastUpdated: item.item_update_date || item.last_updated || new Date().toISOString(),
        department: item.department || '',
        item_status: item.item_status as 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Inactive',
      }));
  }

  console.log('No data found in database, generating 100 sample items');

  // Lista realista de productos agrupados por departamento (inspirado en Publix)
  const realSamples: { name: string; department: string; }[] = [
    // Produce (15)
    { name: "Fresh Apples Gala", department: "Produce" },
    { name: "Organic Bananas", department: "Produce" },
    { name: "Romaine Lettuce", department: "Produce" },
    { name: "Sweet Strawberries", department: "Produce" },
    { name: "Blueberries Pint", department: "Produce" },
    { name: "Red Seedless Grapes", department: "Produce" },
    { name: "Baby Carrots", department: "Produce" },
    { name: "Green Bell Pepper", department: "Produce" },
    { name: "Vidalia Onions", department: "Produce" },
    { name: "Sliced Watermelon", department: "Produce" },
    { name: "Organic Spinach", department: "Produce" },
    { name: "Golden Pineapple", department: "Produce" },
    { name: "Fresh Broccoli", department: "Produce" },
    { name: "Avocado Hass", department: "Produce" },
    { name: "Cucumber", department: "Produce" },

    // Dairy (12)
    { name: "Publix Whole Milk", department: "Dairy" },
    { name: "Organic Greek Yogurt", department: "Dairy" },
    { name: "Large Brown Eggs", department: "Dairy" },
    { name: "Butter Unsalted", department: "Dairy" },
    { name: "Shredded Cheddar Cheese", department: "Dairy" },
    { name: "Lowfat Cottage Cheese", department: "Dairy" },
    { name: "Sour Cream", department: "Dairy" },
    { name: "Feta Cheese Crumbles", department: "Dairy" },
    { name: "Swiss Cheese Slices", department: "Dairy" },
    { name: "Provolone Slices", department: "Dairy" },
    { name: "Heavy Whipping Cream", department: "Dairy" },
    { name: "Vanilla Pudding Cups", department: "Dairy" },

    // Meat & Seafood (14)
    { name: "Ground Chuck Beef", department: "Meat & Seafood" },
    { name: "Fresh Chicken Breast", department: "Meat & Seafood" },
    { name: "Center Cut Pork Chops", department: "Meat & Seafood" },
    { name: "Salmon Fillet", department: "Meat & Seafood" },
    { name: "Large Raw Shrimp", department: "Meat & Seafood" },
    { name: "Sliced Turkey Breast", department: "Meat & Seafood" },
    { name: "Sirloin Steak", department: "Meat & Seafood" },
    { name: "Italian Sausage Links", department: "Meat & Seafood" },
    { name: "Tilapia Fillets", department: "Meat & Seafood" },
    { name: "Catfish Nuggets", department: "Meat & Seafood" },
    { name: "Chicken Drumsticks", department: "Meat & Seafood" },
    { name: "Crab Imitation", department: "Meat & Seafood" },
    { name: "Beef Stew Meat", department: "Meat & Seafood" },
    { name: "Atlantic Scallops", department: "Meat & Seafood" },

    // Bakery (11)
    { name: "French Baguette", department: "Bakery" },
    { name: "7-Grain Bread", department: "Bakery" },
    { name: "Croissants Butter", department: "Bakery" },
    { name: "Blueberry Muffins", department: "Bakery" },
    { name: "Sourdough Boule", department: "Bakery" },
    { name: "Buttermilk Biscuits", department: "Bakery" },
    { name: "Chocolate Chip Cookies", department: "Bakery" },
    { name: "Apple Fritters", department: "Bakery" },
    { name: "Cinnamon Rolls", department: "Bakery" },
    { name: "Glazed Donuts 6ct", department: "Bakery" },
    { name: "Cake Slices Vanilla", department: "Bakery" },

    // Frozen Foods (12)
    { name: "Frozen Pepperoni Pizza", department: "Frozen Foods" },
    { name: "Organic Frozen Spinach", department: "Frozen Foods" },
    { name: "Chicken Bites", department: "Frozen Foods" },
    { name: "Vanilla Ice Cream", department: "Frozen Foods" },
    { name: "Berry Blend Frozen", department: "Frozen Foods" },
    { name: "French Fries Bag", department: "Frozen Foods" },
    { name: "Veggie Mix Steamer", department: "Frozen Foods" },
    { name: "Microwavable Burritos", department: "Frozen Foods" },
    { name: "Cheese Ravioli Frozen", department: "Frozen Foods" },
    { name: "Frozen Garlic Bread", department: "Frozen Foods" },
    { name: "Meatballs Beef", department: "Frozen Foods" },
    { name: "Potato Tots", department: "Frozen Foods" },

    // Beverages (10)
    { name: "Publix Purified Water", department: "Beverages" },
    { name: "Coca-Cola 12pk", department: "Beverages" },
    { name: "Orange Juice", department: "Beverages" },
    { name: "Sweet Tea Gallon", department: "Beverages" },
    { name: "Coffee Ground Medium", department: "Beverages" },
    { name: "Root Beer 6pk", department: "Beverages" },
    { name: "Whole Milk Half-Gallon", department: "Beverages" },
    { name: "Energy Drink", department: "Beverages" },
    { name: "Lemonade Jug", department: "Beverages" },
    { name: "Sparkling Water", department: "Beverages" },

    // Electronics (12)
    { name: "Portable USB Charger", department: "Electronics" },
    { name: "Wireless Earbuds", department: "Electronics" },
    { name: "LED Light Bulbs", department: "Electronics" },
    { name: "Alkaline Batteries AA", department: "Electronics" },
    { name: "Digital Thermometer", department: "Electronics" },
    { name: "Bluetooth Speaker", department: "Electronics" },
    { name: "Phone Car Charger", department: "Electronics" },
    { name: "Smart Power Strip", department: "Electronics" },
    { name: "USB-C Cable 6ft", department: "Electronics" },
    { name: "Portable Fan USB", department: "Electronics" },
    { name: "Travel Alarm Clock", department: "Electronics" },
    { name: "Memory Card 32GB", department: "Electronics" },

    // Health & Beauty (14)
    { name: "Multivitamin Gummies", department: "Health & Beauty" },
    { name: "Antibacterial Hand Soap", department: "Health & Beauty" },
    { name: "Moisturizing Lotion", department: "Health & Beauty" },
    { name: "Daily Toothpaste", department: "Health & Beauty" },
    { name: "Cotton Swabs 500ct", department: "Health & Beauty" },
    { name: "Facial Cleansing Wipes", department: "Health & Beauty" },
    { name: "Dandruff Shampoo", department: "Health & Beauty" },
    { name: "Disposable Razor 5ct", department: "Health & Beauty" },
    { name: "Sensitive Skin Deodorant", department: "Health & Beauty" },
    { name: "Pain Relief Tablets", department: "Health & Beauty" },
    { name: "Kids Toothbrush", department: "Health & Beauty" },
    { name: "Hydrating Face Mask", department: "Health & Beauty" },
    { name: "Herbal Mouthwash", department: "Health & Beauty" },
    { name: "Lip Balm SPF", department: "Health & Beauty" },
  ];

  // Prefijos para cada departamento
  const departmentPrefixes: { [key: string]: string } = {
    "Produce": "PRD",
    "Dairy": "DRY",
    "Meat & Seafood": "MST",
    "Bakery": "BKY",
    "Frozen Foods": "FRZ",
    "Beverages": "BEV",
    "Electronics": "ELC",
    "Health & Beauty": "HLT",
  };

  // Inicializa contadores para cada departamento
  const departmentCounters: { [key: string]: number } = {};
  Object.keys(departmentPrefixes).forEach(dep => {
    departmentCounters[dep] = 0;
  });

  const { v4: uuidv4 } = await import('uuid');
  const statuses: Array<'In Stock' | 'Low Stock' | 'Out of Stock'> = ["In Stock", "Low Stock", "Out of Stock"];
  const sampleItems: InventoryItem[] = [];

  for (let i = 0; i < 100; i++) {
    const prod = realSamples[i % realSamples.length];
    // Usa el prefijo asignado, si no existe asigna "OTH"
    const dep = prod.department;
    const prefix = departmentPrefixes[dep] || "OTH";
    departmentCounters[dep] = (departmentCounters[dep] || 0) + 1;
    const skuNumber = (departmentCounters[dep] + 1000).toString(); // Para que empiece en 1001
    const sku = `${prefix}-${skuNumber}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const quantity = status === "Out of Stock" ? 0 : Math.floor(Math.random() * 200) + 1;
    const expectedStock = quantity + Math.floor(Math.random() * 50);
    const costPrice = parseFloat((Math.random() * 20 + 2).toFixed(2));
    const retailPrice = parseFloat((costPrice * (Math.random() * 0.75 + 1.20)).toFixed(2));
    sampleItems.push({
      id: uuidv4(),
      name: prod.name,
      sku: sku,
      category: prod.department, // El nombre del departamento como category
      department: prod.department,
      item_quantity: quantity,
      expectedStock: expectedStock,
      costPrice: costPrice,
      retailPrice: retailPrice,
      lastUpdated: new Date().toISOString(),
      item_status: status
    });
  }

  // Intentar insertar sampleItems en la DB solo si hay error de fetch
  try {
    const { error: insertError } = await supabase
      .from('inventory_items')
      .insert(sampleItems.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        department: item.department,
        item_quantity: item.item_quantity,
        expected_stock: item.expectedStock,
        cost_price: item.costPrice,
        retail_price: item.retailPrice,
        item_update_date: item.lastUpdated,
        item_status: item.item_status
      })));
    if (insertError) {
      console.error('Error inserting sample inventory items:', insertError);
    } else {
      console.log('Successfully inserted 100 sample inventory items into database');
    }
  } catch (err) {
    console.error('Failed to insert sample inventory items:', err);
  }
  return sampleItems;
};

// Mock data service until connected to a backend
const mockInventoryItems: InventoryItem[] = [
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

// Define a type for the raw stock movement data from Supabase
type RawStockMovement = {
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

export const fetchStockMovements = async (): Promise<StockMovement[]> => {
  // Try fetching from Supabase
  try {
    const { data: supabaseData, error } = await supabase
      .from('stock_movements')
      .select('*, inventory_items(name)');

    if (error) {
      console.error('Error fetching stock movements:', error);
      return mockStockMovements;
    }

    if (supabaseData && supabaseData.length > 0) {
      // Cast the data to our defined type to handle the structure properly
      return (supabaseData as RawStockMovement[]).map(movement => {
        // Safe access to nested properties with proper nullability checks
        const itemName = movement.inventory_items?.name || 'Unknown Item';
        
        return {
          id: movement.id,
          itemId: movement.item_id,
          itemName: itemName,
          type: movement.type as 'received' | 'sold' | 'damaged' | 'stolen' | 'adjustment',
          quantity: movement.quantity,
          date: movement.created_at,
          employeeName: movement.employee_id ? `Employee ${movement.employee_id}` : 'System',
        };
      });
    }
  } catch (err) {
    console.error('Failed to process stock movements:', err);
  }

  return mockStockMovements;
};

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

export const fetchShrinkageData = async (): Promise<ShrinkageData[]> => {
  // Try fetching from Supabase
  const { data: supabaseData, error } = await supabase
    .from('monthly_shrinkage')
    .select('*')
    .order('month', { ascending: true });

  if (error) {
    console.error('Error fetching shrinkage data:', error);
    return shrinkageData;
  }

  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(item => ({
      month: item.month,
      shrinkage: item.shrinkage,
      sales: item.sales,
    }));
  }

  return shrinkageData;
};

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

export const fetchDepartmentShrinkage = async (): Promise<DepartmentShrinkage[]> => {
  const { data: supabaseData, error } = await supabase
    .from('department_shrinkage')
    .select('*');

  if (error) {
    console.error('Error fetching department shrinkage:', error);
    return departmentShrinkage;
  }

  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(item => ({
      name: item.name,
      shrinkageRate: item.shrinkage_rate,
      avgRate: item.avg_rate,
    }));
  }

  return departmentShrinkage;
};

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

export const fetchShrinkageReasons = async (): Promise<ShrinkageReason[]> => {
  const { data: supabaseData, error } = await supabase
    .from('shrinkage_reasons')
    .select('*');

  if (error) {
    console.error('Error fetching shrinkage reasons:', error);
    return shrinkageReasons;
  }

  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(item => ({
      name: item.name,
      value: item.value,
    }));
  }

  return shrinkageReasons;
};

const shrinkageReasons: ShrinkageReason[] = [
  { name: "Theft", value: 38 },
  { name: "Spoilage", value: 27 },
  { name: "Admin Error", value: 15 },
  { name: "Vendor Issue", value: 12 },
  { name: "Damage", value: 8 },
];

// NUEVO: Función para obtener los departamentos desde la tabla "departments"
export interface Department {
  department_id: number;
  name: string;
}

export const fetchDepartments = async (): Promise<Department[]> => {
  // Obtener los departamentos desde Supabase
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching departments:', error);
    return [];
  }

  return data as Department[] || [];
};

// React Query hook para obtener departamentos
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });
};

// React Query hooks
export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventoryItems'],
    queryFn: fetchInventoryItems,
    staleTime: 1000 * 60, // 1 minute
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
