
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export function useUserSettings(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user_settings", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data as Database["public"]["Tables"]["user_settings"]["Row"] | null;
    },
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<Database["public"]["Tables"]["user_settings"]["Update"]>) => {
      if (!userId) return;
      const { error } = await supabase
        .from("user_settings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_settings", userId] });
    },
  });

  return {
    settings: data,
    isLoading,
    error,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
