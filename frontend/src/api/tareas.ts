import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Tarea {
  id: string;
  titulo: string;
  estado: "pendiente" | "en_progreso" | "bloqueada" | "completada" | "cancelada";
  proyectoId: string;
  createdAt?: string;
}

const tareaColumns = "id,titulo,estado,proyectoId,createdAt";

export function useTareas() {
  return useQuery({
    queryKey: ["tareas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Tarea").select(tareaColumns).order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Tarea[];
    },
  });
}

export function useTarea(id: string | undefined) {
  return useQuery({
    queryKey: ["tareas", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from("Tarea").select(tareaColumns).eq("id", id).single();
      if (error) throw error;
      return data as Tarea;
    },
  });
}

export function useCrearTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Tarea>) => {
      const { data: created, error } = await supabase.from("Tarea").insert(data).select(tareaColumns).single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tareas"] }),
  });
}

export function useActualizarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Tarea> }) => {
      const { data: updated, error } = await supabase.from("Tarea").update(data).eq("id", id).select(tareaColumns).single();
      if (error) throw error;
      return updated as Tarea;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      queryClient.invalidateQueries({ queryKey: ["tareas", variables.id] });
    },
  });
}

export function useEliminarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Tarea").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
      queryClient.removeQueries({ queryKey: ["tareas", id] });
    },
  });
}