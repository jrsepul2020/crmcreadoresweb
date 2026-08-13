import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

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
      const { data, error } = await supabase.from("Proveedor").select("*").order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Proveedor[];
    },
  });
}

export function useCrearProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Proveedor>) => {
      const { data: created, error } = await supabase.from("Proveedor").insert(data).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proveedores"] }),
  });
}

export function useEliminarProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Proveedor").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proveedores"] }),
  });
}