import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export interface Tarea {
  id: string;
  titulo: string;
  estado: string;
  proyectoId: string;
}

export function useTareas() {
  return useQuery({ queryKey: ["tareas"], queryFn: async () => (await api.get<Tarea[]>("/tareas")).data });
}

export function useCrearTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Tarea>) => (await api.post<Tarea>("/tareas", data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tareas"] }),
  });
}

export function useEliminarTarea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/tareas/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tareas"] }),
  });
}