import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockInventoryItems } from './mockData';
import { InventoryItem } from './inventoryTypes';

// API service functions for inventory items
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  console.log('Fetching inventory items from database...');
  
  const { data: supabaseData, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('name', { ascending: true })
    .neq('item_status', 'Inactive');

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
        category: item.department || '',
        item_quantity: item.item_quantity || 0,
        expectedStock: item.expected_stock || item.item_quantity || 0,
        costPrice: item.cost_price || 0,
        retailPrice: item.retail_price || 0,
        lastUpdated: item.item_update_date || item.last_updated || new Date().toISOString(),
        department: item.department || '',
        item_status: item.item_status as 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Inactive',
      }));
  }

  console.log('No data found in database, generating sample items');
  
  // Generate sample data if no database data exists
  const { v4: uuidv4 } = await import('uuid');
  const sampleItems = await generateSampleItems(uuidv4);
  
  // Try to insert sample data into database
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
      console.log('Successfully inserted sample inventory items into database');
    }
  } catch (err) {
    console.error('Failed to insert sample inventory items:', err);
  }
  
  return sampleItems;
};

async function generateSampleItems(uuidv4: () => string): Promise<InventoryItem[]> {
  // This is the sample item generation code from the original inventoryService.ts
  // Keeping it for data generation when database is empty
  // ... Sample data generation code (kept same as original)
  
  // List of realistic products by department
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

    // Other departments kept for sample generation
    // ... other departments like Bakery, Frozen Foods, etc.
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

  // SKU prefixes for each department
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

  // Initialize counters for departments
  const departmentCounters: { [key: string]: number } = {};
  Object.keys(departmentPrefixes).forEach(dep => {
    departmentCounters[dep] = 0;
  });

  const statuses: Array<'In Stock' | 'Low Stock' | 'Out of Stock'> = ["In Stock", "Low Stock", "Out of Stock"];
  const sampleItems: InventoryItem[] = [];

  for (let i = 0; i < 100; i++) {
    const prod = realSamples[i % realSamples.length];
    // Use the prefix for the department
    const dep = prod.department;
    const prefix = departmentPrefixes[dep] || "OTH";
    departmentCounters[dep] = (departmentCounters[dep] || 0) + 1;
    const skuNumber = (departmentCounters[dep] + 1000).toString(); // Start at 1001
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
      category: prod.department, // Department name as category
      department: prod.department,
      item_quantity: quantity,
      expectedStock: expectedStock,
      costPrice: costPrice,
      retailPrice: retailPrice,
      lastUpdated: new Date().toISOString(),
      item_status: status
    });
  }

  return sampleItems;
}

// React Query hook for inventory items
export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventoryItems'],
    queryFn: fetchInventoryItems,
    staleTime: 1000 * 60, // 1 minute
  });
};
