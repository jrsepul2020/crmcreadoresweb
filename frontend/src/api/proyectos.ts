import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

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
      const res = await api.get<Proyecto[]>("/proyectos");
      return res.data;
    },
  });
}

export function useCrearProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Proyecto>) => {
      const res = await api.post<Proyecto>("/proyectos", data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proyectos"] }),
  });
}

export function useEliminarProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/proyectos/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proyectos"] }),
  });
}