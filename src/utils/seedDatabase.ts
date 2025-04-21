
// Utility to seed all "module" tables with demo data for local/testing use.

import { supabase } from "@/integrations/supabase/client";

// --- INVENTORY ITEMS DEMO DATA ---
const inventoryItems = [
  {
    sku: "PRD-001",
    name: "Organic Apples",
    department: "Produce",
    quantity: 142,
    status: "In Stock",
  },
  {
    sku: "MT-105",
    name: "Ribeye Steak",
    department: "Meat",
    quantity: 10,
    status: "Critical",
  },
  {
    sku: "BKR-318",
    name: "Sourdough Bread",
    department: "Bakery",
    quantity: 29,
    status: "Low Stock",
  },
  {
    sku: "HST-470",
    name: "Pain Reliever",
    department: "Health",
    quantity: 33,
    status: "In Stock",
  },
  {
    sku: "BVG-901",
    name: "Sparkling Water",
    department: "Beverages",
    quantity: 90,
    status: "In Stock",
  },
  {
    sku: "DAI-008",
    name: "Whole Milk",
    department: "Dairy",
    quantity: 65,
    status: "In Stock",
  },
  {
    sku: "ELC-102",
    name: "Wireless Earbuds",
    department: "Electronics",
    quantity: 18,
    status: "In Stock",
  },
  {
    sku: "PRD-022",
    name: "Bananas",
    department: "Produce",
    quantity: 100,
    status: "In Stock",
  },
  {
    sku: "FZN-234",
    name: "Frozen Peas",
    department: "Frozen",
    quantity: 200,
    status: "In Stock",
  },
  {
    sku: "GRC-045",
    name: "Premium Coffee",
    department: "Beverages",
    quantity: 48,
    status: "Low Stock",
  },
];

// --- PROFILES DEMO DATA ---
const demoProfiles = [
  {
    id: "bd7920b8-aead-46ad-80e3-d1daba545039",
    first_name: "Demo",
    last_name: "User",
  },
  {
    id: "7c02aa92-0618-409b-9545-c3b113a57a34",
    first_name: "Stock",
    last_name: "Manager",
  },
  {
    id: "00000000-0000-0000-0000-000000000000",
    first_name: "Super",
    last_name: "Admin",
  },
];

// --- SETTINGS DEMO DATA ---
const demoSettings = [
  {
    user_id: "bd7920b8-aead-46ad-80e3-d1daba545039",
    store_name: "ShelfWatch Demo Store",
    theme: "Light",
    auto_sync: true,
  },
  {
    user_id: "7c02aa92-0618-409b-9545-c3b113a57a34",
    store_name: "ShelfWatch Test Store",
    theme: "Dark",
    auto_sync: false,
  },
];

export async function seedDatabase() {
  // Seed PROFILES (skip if they already exist)
  for (const prof of demoProfiles) {
    const { data: exists } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", prof.id)
      .maybeSingle();
    if (!exists) {
      await supabase.from("profiles").insert([
        {
          id: prof.id,
          first_name: prof.first_name,
          last_name: prof.last_name,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  // Seed USER SETTINGS (skip if rows already present for the demo users)
  for (const s of demoSettings) {
    const { data: exists } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", s.user_id)
      .maybeSingle();
    if (!exists) {
      await supabase.from("user_settings").insert([
        {
          user_id: s.user_id,
          store_name: s.store_name,
          theme: s.theme,
          auto_sync: s.auto_sync,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  // Seed INVENTORY ITEMS (skip if table already seeded)
  const { data: existingItems } = await supabase
    .from("inventory_items")
    .select("id");
  if (!existingItems || existingItems.length === 0) {
    const today = new Date().toISOString();
    const userId = "00000000-0000-0000-0000-000000000000";
    await supabase.from("inventory_items").insert(
      inventoryItems.map((item) => ({
        ...item,
        last_updated: today,
        user_id: userId,
      }))
    );
  }

  // You can extend here with more modules (audits, loss alerts, etc.)
  // console.log("Database seeding complete.");
}

// Usage: Run `seedDatabase()` from a test page or a browser console after site load.
