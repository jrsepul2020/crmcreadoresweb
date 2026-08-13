import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  nif?: string;
  empresa?: string;
  personaContacto?: string;
  direccion?: string;
  codigoPostal?: string;
  poblacion?: string;
  provincia?: string;
  notas?: string;
  createdAt?: string;
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

export function useActualizarCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cliente> }) => {
      const { data: updated, error } = await supabase.from("Cliente").update(data).eq("id", id).select().single();
      if (error) throw error;
      return updated;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clientes"] }),
  });
}