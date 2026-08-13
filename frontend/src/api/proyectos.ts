import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Proyecto {
  id: string;
  nombre: string;
  estado: string;
  clienteId: string;
}

export function useProyectos() {
  return useQuery({
    queryKey: ["proyectos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Proyecto").select("*").order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Proyecto[];
    },
  });
}

export function useCrearProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Proyecto>) => {
      const { data: created, error } = await supabase.from("Proyecto").insert(data).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proyectos"] }),
  });
}

export function useEliminarProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Proyecto").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proyectos"] }),
  });
}