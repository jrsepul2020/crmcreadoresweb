import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export type Periodicidad = "mensual" | "trimestral" | "anual";
export type ServicioRecurrenteEstado = "activo" | "pausado" | "cancelado";

export interface ServicioRecurrente {
  id: string;
  clienteId: string;
  productoId?: string;
  descripcion: string;
  precio: number;
  periodicidad: Periodicidad;
  fechaInicio: string;
  proximaRenovacion: string;
  estado: ServicioRecurrenteEstado;
  notas?: string;
  createdAt?: string;
}

const columns = "id,clienteId,productoId,descripcion,precio,periodicidad,fechaInicio,proximaRenovacion,estado,notas,createdAt";

export function useServiciosRecurrentes() {
  return useQuery({
    queryKey: ["servicios-recurrentes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ServicioRecurrente").select(columns).order("proximaRenovacion", { ascending: true });
      if (error) throw error;
      return data as ServicioRecurrente[];
    },
  });
}

export function useServicioRecurrente(id: string | undefined) {
  return useQuery({
    queryKey: ["servicios-recurrentes", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from("ServicioRecurrente").select(columns).eq("id", id).single();
      if (error) throw error;
      return data as ServicioRecurrente;
    },
  });
}

export function useCrearServicioRecurrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<ServicioRecurrente>) => {
      const { data: created, error } = await supabase.from("ServicioRecurrente").insert(data).select(columns).single();
      if (error) throw error;
      return created as ServicioRecurrente;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicios-recurrentes"] });
    },
  });
}

export function useActualizarServicioRecurrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServicioRecurrente> }) => {
      const { data: updated, error } = await supabase.from("ServicioRecurrente").update(data).eq("id", id).select(columns).single();
      if (error) throw error;
      return updated as ServicioRecurrente;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["servicios-recurrentes"] });
      queryClient.invalidateQueries({ queryKey: ["servicios-recurrentes", variables.id] });
    },
  });
}

export function useEliminarServicioRecurrente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ServicioRecurrente").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["servicios-recurrentes"] });
      queryClient.removeQueries({ queryKey: ["servicios-recurrentes", id] });
    },
  });
}
