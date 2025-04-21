
  // CSV import
  const handleImportCSV = async (items: Omit<InventoryItemType, "id" | "lastUpdated">[]) => {
    const today = new Date().toISOString();
    const dbItems = items.map(item => ({
      ...item,
      last_updated: today,
      // Convert quantity to number for the database
      quantity: Number(item.quantity),
      user_id: "00000000-0000-0000-0000-000000000000",
    }));
    const { error } = await supabase.from("inventory_items").insert(dbItems);
    if (error) {
      toast({ title: "Import Failed", description: "Failed to import CSV." });
    } else {
      toast({ title: "Import Successful", description: `${dbItems.length} items imported.` });
      refetch();
    }
  };

  // CSV export
  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ["sku", "name", "department", "quantity", "status", "lastUpdated"];
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

    toast({
      title: "CSV Export Successful",
      description: `${filteredData.length} items exported to CSV.`,
    });
  };
