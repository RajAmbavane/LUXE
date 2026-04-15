import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFirstCaseId(): string | undefined {
  const { data } = useQuery({
    queryKey: ["first-case-id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (error) return null;
      return data?.id ?? null;
    },
  });
  return data ?? undefined;
}
