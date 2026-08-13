import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  tipo: string;
}

export function useProductos() {
  return useQuery({
    queryKey: ["productos"],
    queryFn: async () => {
      const res = await api.get<Producto[]>("/productos");
      return res.data;
    },
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Producto>) => {
      const res = await api.post<Producto>("/productos", data);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/productos/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}