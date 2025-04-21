import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Inventory item type based on the Supabase schema
type InventoryItem = {
  id: string;
  name: string;
  sku: string | null;
  quantity: number;
  department: string | null;
  status: string;
  cost_price: number | null;
  retail_price: number | null;
  expected_stock: number | null;
  last_updated: string;
};

export default function InventoryList() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<InventoryItem[]>([]);

  const { data: inventoryData, isLoading, error } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("last_updated", { ascending: false });

      if (error) throw error;
      return data as InventoryItem[];
    },
  });

  useEffect(() => {
    if (inventoryData) {
      setItems(inventoryData);
    }
  }, [inventoryData]);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    (item.sku?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  if (isLoading) return <div>Loading inventory...</div>;
  if (error) return <div>Error loading inventory</div>;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-3 py-2 rounded border border-gray-200 w-full md:w-72 bg-white focus:outline-primary"
            placeholder="Search inventory"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>
      <div className="rounded border bg-white shadow-sm overflow-x-auto animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Retail</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length ? (
              filteredItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku || "N/A"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.department || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.status}</Badge>
                  </TableCell>
                  <TableCell>${item.cost_price?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell>${item.retail_price?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
