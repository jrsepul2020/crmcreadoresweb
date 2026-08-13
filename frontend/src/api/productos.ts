import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

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
      const { data, error } = await supabase.from("Producto").select("*").order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Producto[];
    },
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Producto>) => {
      const { data: created, error } = await supabase.from("Producto").insert(data).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Producto").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}