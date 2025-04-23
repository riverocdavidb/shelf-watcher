
import type { InventoryItem } from "../AddEditItemDialog";

export const handleExportCSV = (filteredData: InventoryItem[]) => {
  if (!filteredData.length) return;
  
  const headers = ["sku", "name", "department", "item_quantity", "item_status", "lastUpdated"];
  const csvRows = [
    headers.join(","),
    ...filteredData.map(item => 
      headers.map(header => (item as any)[header]).join(",")
    )
  ];
  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "inventory_export.csv");
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return filteredData.length;
};
