
import * as z from "zod";

export const movementSchema = z.object({
  sku: z.string().min(3, "SKU required"),
  itemName: z.string().min(2),
  type: z.enum(["received", "sold", "damaged", "stolen", "adjustment"]),
  quantity: z.coerce.number().int().positive("Must be positive"),
  employee: z.string(),
  date: z.union([z.date(), z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use MM/DD/YYYY")])
});

export type MovementFormInputs = z.infer<typeof movementSchema>;

export interface MovementFormProps {
  onSave: (data: Omit<MovementFormInputs, "itemName">) => void;
  initialSku?: string;
}
