
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { shrinkageData, departmentShrinkage, shrinkageReasons } from './mockData';
import { ShrinkageData, DepartmentShrinkage, ShrinkageReason } from './inventoryTypes';

// Fetch monthly shrinkage data
export const fetchShrinkageData = async (): Promise<ShrinkageData[]> => {
  const { data: supabaseData, error } = await supabase
    .from('monthly_shrinkage')
    .select('*')
    .order('month', { ascending: true });

  if (error) {
    console.error('Error fetching shrinkage data:', error);
    return shrinkageData;
  }

  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(item => ({
      month: item.month,
      shrinkage: item.shrinkage,
      sales: item.sales,
    }));
  }

  return shrinkageData;
};

// Fetch department shrinkage data
export const fetchDepartmentShrinkage = async (): Promise<DepartmentShrinkage[]> => {
  const { data: supabaseData, error } = await supabase
    .from('department_shrinkage')
    .select('*');

  if (error) {
    console.error('Error fetching department shrinkage:', error);
    return departmentShrinkage;
  }

  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(item => ({
      name: item.name,
      shrinkageRate: item.shrinkage_rate,
      avgRate: item.avg_rate,
    }));
  }

  return departmentShrinkage;
};

// Fetch shrinkage reasons data
export const fetchShrinkageReasons = async (): Promise<ShrinkageReason[]> => {
  const { data: supabaseData, error } = await supabase
    .from('shrinkage_reasons')
    .select('*');

  if (error) {
    console.error('Error fetching shrinkage reasons:', error);
    return shrinkageReasons;
  }

  if (supabaseData && supabaseData.length > 0) {
    return supabaseData.map(item => ({
      name: item.name,
      value: item.value,
    }));
  }

  return shrinkageReasons;
};

// React Query hooks
export const useShrinkageData = () => {
  return useQuery({
    queryKey: ['shrinkageData'],
    queryFn: fetchShrinkageData,
  });
};

export const useDepartmentShrinkage = () => {
  return useQuery({
    queryKey: ['departmentShrinkage'],
    queryFn: fetchDepartmentShrinkage,
  });
};

export const useShrinkageReasons = () => {
  return useQuery({
    queryKey: ['shrinkageReasons'],
    queryFn: fetchShrinkageReasons,
  });
};
