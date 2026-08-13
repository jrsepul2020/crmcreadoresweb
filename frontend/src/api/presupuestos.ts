import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export interface Presupuesto {
  id: string;
  numero: string;
  estado: string;
  total: number;
  clienteId: string;
}

export function usePresupuestos() {
  return useQuery({ queryKey: ["presupuestos"], queryFn: async () => (await api.get<Presupuesto[]>("/presupuestos")).data });
}

export function useCrearPresupuesto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Presupuesto>) => (await api.post<Presupuesto>("/presupuestos", data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["presupuestos"] }),
  });
}

export function useEliminarPresupuesto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { await api.delete(`/presupuestos/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["presupuestos"] }),
  });
}