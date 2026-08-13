import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Presupuesto {
  id: string;
  numero: string;
  estado: string;
  total: number;
  clienteId: string;
}

export function usePresupuestos() {
  return useQuery({
    queryKey: ["presupuestos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Presupuesto").select("*").order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Presupuesto[];
    },
  });
}

export function useCrearPresupuesto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Presupuesto>) => {
      const { data: created, error } = await supabase.from("Presupuesto").insert(data).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["presupuestos"] }),
  });
}

export function useEliminarPresupuesto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Presupuesto").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["presupuestos"] }),
  });
}