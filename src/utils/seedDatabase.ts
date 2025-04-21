
// Utility to seed all "module" tables with demo data for local/testing use.

import { supabase } from "@/integrations/supabase/client";

// --- INVENTORY ITEMS SAMPLE DATA ---
const inventoryItems = [
  { id: "item-1", sku: "PRD-001", name: "Organic Apples", department: "Produce", quantity: 142, status: "In Stock" },
  { id: "item-2", sku: "GRC-045", name: "Premium Coffee", department: "Beverages", quantity: 48, status: "Low Stock" },
  { id: "item-3", sku: "ELC-102", name: "Wireless Earbuds", department: "Electronics", quantity: 18, status: "In Stock" },
  { id: "item-4", sku: "DAI-008", name: "Whole Milk", department: "Dairy", quantity: 65, status: "In Stock" },
  { id: "item-5", sku: "MT-105", name: "Ribeye Steak", department: "Meat", quantity: 10, status: "Critical" },
  { id: "item-6", sku: "FZN-234", name: "Frozen Peas", department: "Frozen", quantity: 200, status: "In Stock" },
  { id: "item-7", sku: "BKR-318", name: "Sourdough Bread", department: "Bakery", quantity: 29, status: "Low Stock" },
  { id: "item-8", sku: "HST-470", name: "Pain Reliever", department: "Health", quantity: 33, status: "In Stock" },
  { id: "item-9", sku: "BVG-901", name: "Sparkling Water", department: "Beverages", quantity: 90, status: "In Stock" },
  { id: "item-10", sku: "PRD-022", name: "Bananas", department: "Produce", quantity: 100, status: "In Stock" },
];

// --- PROFILES SAMPLE DATA ---
const demoProfiles = [
  { id: "user-1", first_name: "Demo", last_name: "User" },
  { id: "user-2", first_name: "Stock", last_name: "Manager" },
  { id: "user-3", first_name: "Super", last_name: "Admin" },
];

// --- SETTINGS SAMPLE DATA ---
const demoSettings = [
  { user_id: "user-1", store_name: "ShelfWatch Demo Store", theme: "Light", auto_sync: true },
  { user_id: "user-2", store_name: "ShelfWatch Test Store", theme: "Dark", auto_sync: false },
];

// --- AUDITS SAMPLE DATA ---
const audits = [
  {
    id: "audit-1",
    title: "April Inventory Check",
    department: "Produce",
    start_date: "2025-04-10T09:00:00Z",
    end_date: "2025-04-14T18:00:00Z",
    status: "Completed",
    assigned_to: "user-1",
    created_by: "user-3",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "audit-2",
    title: "March Cycle Count",
    department: "Dairy",
    start_date: "2025-03-22T09:00:00Z",
    end_date: null,
    status: "In Progress",
    assigned_to: "user-2",
    created_by: "user-3",
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// --- STOCK MOVEMENTS DATA ---
const stockMovements = [
  {
    id: "move-1",
    item_id: "item-1",
    type: "received",
    quantity: 50,
    employee_id: "user-1",
    notes: "Initial delivery",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "move-2",
    item_id: "item-1",
    type: "sold",
    quantity: -42,
    employee_id: "user-2",
    notes: "Weekend sale",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "move-3",
    item_id: "item-1",
    type: "damaged",
    quantity: -8,
    employee_id: "user-1",
    notes: "Damaged during transport",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// --- DEPARTMENT SHRINKAGE DATA ---
const departmentShrinkage = [
  { id: "deptshr-1", name: "Produce", shrinkage_rate: 2.8, avg_rate: 1.6, month: "Apr", year: 2025 },
  { id: "deptshr-2", name: "Dairy", shrinkage_rate: 0.9, avg_rate: 1.2, month: "Apr", year: 2025 },
  { id: "deptshr-3", name: "Meat", shrinkage_rate: 3.2, avg_rate: 2.5, month: "Apr", year: 2025 },
];

// --- MONTHLY SHRINKAGE DATA ---
const monthlyShrinkage = [
  { id: "mo-jan", month: "Jan", shrinkage: 8450, sales: 124000, year: 2025 },
  { id: "mo-feb", month: "Feb", shrinkage: 7800, sales: 128000, year: 2025 },
  { id: "mo-mar", month: "Mar", shrinkage: 9200, sales: 132000, year: 2025 },
  { id: "mo-apr", month: "Apr", shrinkage: 10500, sales: 145000, year: 2025 },
];

// --- SHRINKAGE REASONS DATA ---
const shrinkageReasons = [
  { id: "sr-1", name: "Theft", value: 38, year: 2025, month: "Apr" },
  { id: "sr-2", name: "Spoilage", value: 27, year: 2025, month: "Apr" },
  { id: "sr-3", name: "Admin Error", value: 15, year: 2025, month: "Apr" },
  { id: "sr-4", name: "Vendor Issue", value: 12, year: 2025, month: "Apr" },
  { id: "sr-5", name: "Damage", value: 8, year: 2025, month: "Apr" },
];

// --- HIGH RISK ITEMS, RISK FACTORS, RECOMMENDED ACTIONS DATA ---
const highRiskItems = [
  { id: "risk-1", item_id: "item-7", risk_score: 92, value_at_risk: 640, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Avocados
  { id: "risk-2", item_id: "item-3", risk_score: 77, value_at_risk: 2400, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, // Earbuds
];

// Risk and actions
const riskFactors = [
  { id: "f-1", high_risk_item_id: "risk-1", factor: "High Spoilage" },
  { id: "f-2", high_risk_item_id: "risk-1", factor: "Pricing Error" },
  { id: "f-3", high_risk_item_id: "risk-1", factor: "Handling Damage" },
  { id: "f-4", high_risk_item_id: "risk-2", factor: "Theft Target" },
  { id: "f-5", high_risk_item_id: "risk-2", factor: "Display Security" },
];

const recommendedActions = [
  { id: "a-1", high_risk_item_id: "risk-1", action: "Adjust order quantity" },
  { id: "a-2", high_risk_item_id: "risk-1", action: "Staff training" },
  { id: "a-3", high_risk_item_id: "risk-1", action: "Improve display" },
  { id: "a-4", high_risk_item_id: "risk-2", action: "Security cases" },
  { id: "a-5", high_risk_item_id: "risk-2", action: "Register verification" },
];

// --- INVESTIGATIONS DATA ---
const investigations = [
  {
    id: "case-1",
    title: "Stolen Laptops",
    description: "Multiple laptops stolen from electronics display.",
    loss_amount: 2000,
    status: "Open",
    priority: "High",
    assigned_to: "user-1",
    created_by: "user-3",
    department: "Electronics",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// --- LOSS ALERTS DATA ---
const lossAlerts = [
  {
    id: "alert-1",
    item_id: "item-1",
    title: "Stock Shrinkage - Organic Apples",
    description: "Unexplained reduction of 15 units during count.",
    amount: 49.5,
    severity: "High",
    status: "Open",
    reported_by: "user-2",
    assigned_to: "user-3",
    reported_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "alert-2",
    item_id: "item-4",
    title: "Damaged Goods - Whole Milk",
    description: "Expired/damaged milk found during inspection.",
    amount: 23.5,
    severity: "Medium",
    status: "Open",
    reported_by: "user-1",
    assigned_to: "user-2",
    reported_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// --- INVENTORY STATUS DATA ---
const inventoryStatus = [
  { id: "invst-1", department: "Produce", total_items: 245, tracked_items: 230, discrepancies: 15, shrinkage_rate: 1.2, status: "Warning", updated_at: new Date().toISOString() },
  { id: "invst-2", department: "Dairy", total_items: 178, tracked_items: 178, discrepancies: 3, shrinkage_rate: 0.6, status: "Good", updated_at: new Date().toISOString() },
  { id: "invst-3", department: "Meat & Seafood", total_items: 126, tracked_items: 122, discrepancies: 8, shrinkage_rate: 2.4, status: "Critical", updated_at: new Date().toISOString() },
  { id: "invst-4", department: "Bakery", total_items: 94, tracked_items: 91, discrepancies: 7, shrinkage_rate: 1.8, status: "Warning", updated_at: new Date().toISOString() },
  { id: "invst-5", department: "Frozen Foods", total_items: 210, tracked_items: 210, discrepancies: 2, shrinkage_rate: 0.4, status: "Good", updated_at: new Date().toISOString() },
  { id: "invst-6", department: "Beverages", total_items: 132, tracked_items: 132, discrepancies: 5, shrinkage_rate: 0.9, status: "Good", updated_at: new Date().toISOString() },
];

export async function seedDatabase() {
  // PROFILES
  for (const prof of demoProfiles) {
    const { data: exists } = await supabase.from("profiles").select("id").eq("id", prof.id).maybeSingle();
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

  // USER SETTINGS
  for (const s of demoSettings) {
    const { data: exists } = await supabase.from("user_settings").select("id").eq("user_id", s.user_id).maybeSingle();
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

  // INVENTORY ITEMS
  const { data: existingItems } = await supabase.from("inventory_items").select("id");
  if (!existingItems || existingItems.length === 0) {
    const today = new Date().toISOString();
    for (const it of inventoryItems) {
      await supabase.from("inventory_items").insert([
        {
          id: it.id,
          sku: it.sku,
          name: it.name,
          department: it.department,
          quantity: it.quantity,
          status: it.status,
          user_id: "user-3",
          last_updated: today,
        },
      ]);
    }
  }

  // AUDITS
  for (const audit of audits) {
    const { data: exists } = await supabase.from("audits").select("id").eq("id", audit.id).maybeSingle();
    if (!exists) await supabase.from("audits").insert([audit]);
  }

  // STOCK MOVEMENTS
  for (const sm of stockMovements) {
    const { data: exists } = await supabase.from("stock_movements").select("id").eq("id", sm.id).maybeSingle();
    if (!exists) await supabase.from("stock_movements").insert([sm]);
  }

  // DEPARTMENT SHRINKAGE
  for (const s of departmentShrinkage) {
    const { data: exists } = await supabase.from("department_shrinkage").select("id").eq("id", s.id).maybeSingle();
    if (!exists) await supabase.from("department_shrinkage").insert([s]);
  }

  // MONTHLY SHRINKAGE
  for (const ms of monthlyShrinkage) {
    const { data: exists } = await supabase.from("monthly_shrinkage").select("id").eq("id", ms.id).maybeSingle();
    if (!exists) await supabase.from("monthly_shrinkage").insert([ms]);
  }

  // SHRINKAGE REASONS
  for (const r of shrinkageReasons) {
    const { data: exists } = await supabase.from("shrinkage_reasons").select("id").eq("id", r.id).maybeSingle();
    if (!exists) await supabase.from("shrinkage_reasons").insert([r]);
  }

  // HIGH RISK ITEMS
  for (const hri of highRiskItems) {
    const { data: exists } = await supabase.from("high_risk_items").select("id").eq("id", hri.id).maybeSingle();
    if (!exists) await supabase.from("high_risk_items").insert([hri]);
  }

  // RISK FACTORS
  for (const rf of riskFactors) {
    const { data: exists } = await supabase.from("risk_factors").select("id").eq("id", rf.id).maybeSingle();
    if (!exists) await supabase.from("risk_factors").insert([rf]);
  }

  // RECOMMENDED ACTIONS
  for (const ra of recommendedActions) {
    const { data: exists } = await supabase.from("recommended_actions").select("id").eq("id", ra.id).maybeSingle();
    if (!exists) await supabase.from("recommended_actions").insert([ra]);
  }

  // INVESTIGATIONS
  for (const c of investigations) {
    const { data: exists } = await supabase.from("investigations").select("id").eq("id", c.id).maybeSingle();
    if (!exists) await supabase.from("investigations").insert([c]);
  }

  // LOSS ALERTS
  for (const alert of lossAlerts) {
    const { data: exists } = await supabase.from("loss_alerts").select("id").eq("id", alert.id).maybeSingle();
    if (!exists) await supabase.from("loss_alerts").insert([alert]);
  }

  // INVENTORY STATUS
  for (const s of inventoryStatus) {
    const { data: exists } = await supabase.from("inventory_status").select("id").eq("id", s.id).maybeSingle();
    if (!exists) await supabase.from("inventory_status").insert([s]);
  }

  // console.log("Database seeding complete.");
}

// Usage: Run `seedDatabase()` from a test page or your dev console after site load.
