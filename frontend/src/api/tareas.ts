import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Tarea {
  id: string;
  titulo: string;
  estado: string;
  proyectoId: string;
}

export function useTareas() {
  return useQuery({
    queryKey: ["tareas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Tarea").select("*").order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Tarea[];
    },
  });
}

export function useCrearTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Tarea>) => {
      const { data: created, error } = await supabase.from("Tarea").insert(data).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tareas"] }),
  });
}

export function useEliminarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Tarea").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tareas"] }),
  });
}