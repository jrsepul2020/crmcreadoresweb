import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export interface Proveedor {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  nif?: string;
}

export function useProveedores() {
  return useQuery({
    queryKey: ["proveedores"],
    queryFn: async () => {
      const res = await api.get<Proveedor[]>("/proveedores");
      return res.data;
    },
  });
}

export function useCrearProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Proveedor>) => {
      const res = await api.post<Proveedor>("/proveedores", data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proveedores"] }),
  });
}

export function useEliminarProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/proveedores/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proveedores"] }),
  });
}