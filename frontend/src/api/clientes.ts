import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  nif?: string;
}

export function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Cliente").select("*").order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Cliente[];
    },
  });
}

export function useCrearCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Cliente>) => {
      const { data: created, error } = await supabase.from("Cliente").insert(data).select().single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });
}

export function useEliminarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Cliente").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });
}