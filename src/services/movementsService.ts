
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockStockMovements } from './mockData';
import { StockMovement, RawStockMovement } from './inventoryTypes';

// Fetch stock movements from Supabase or fallback to mock data
export const fetchStockMovements = async (): Promise<StockMovement[]> => {
  try {
    const { data: supabaseData, error } = await supabase
      .from('stock_movements')
      .select('*, inventory_items(name)')
      .order('created_at', { ascending: false });

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

// React Query hook for stock movements
export const useStockMovements = () => {
  return useQuery({
    queryKey: ['stockMovements'],
    queryFn: fetchStockMovements,
  });
};
