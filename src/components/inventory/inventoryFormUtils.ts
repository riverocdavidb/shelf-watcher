
import { z } from "zod";

// Validation schema for the item form
export const inventoryItemFormSchema = z.object({
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  department: z.string().min(1, "Please select a department"),
  item_quantity: z.coerce.number().int().positive("Quantity must be a positive number"),
  item_status: z.string().min(1, "Please select a status"),
});

// Departments and statuses used in the select dropdowns
export const departments = [
  "Produce",
  "Dairy",
  "Meat & Seafood",
  "Bakery",
  "Frozen Foods",
  "Dry Goods",
  "Beverages",
];

export const statuses = ["In Stock", "Low Stock", "Out of Stock", "Inactive"];
