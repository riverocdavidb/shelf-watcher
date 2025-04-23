
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Department } from './inventoryTypes';

// Fetch departments from the database
export const fetchDepartments = async (): Promise<Department[]> => {
  // Obtain departments from Supabase
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

// React Query hook for departments
export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });
};
