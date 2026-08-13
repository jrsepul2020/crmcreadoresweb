import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export interface Proyecto {
  id: string;
  nombre: string;
  estado: "pendiente" | "activo" | "pausado" | "completado" | "cancelado";
  clienteId: string;
  fechaInicio?: string;
  fechaPrevista?: string;
  notas?: string;
  createdAt?: string;
}

const proyectoColumns = "id,nombre,estado,clienteId,fechaInicio,fechaPrevista,notas,createdAt";

export function useProyectos() {
  return useQuery({
    queryKey: ["proyectos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Proyecto").select(proyectoColumns).order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Proyecto[];
    },
  });
}

export function useProyecto(id: string | undefined) {
  return useQuery({
    queryKey: ["proyectos", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase.from("Proyecto").select(proyectoColumns).eq("id", id).single();
      if (error) throw error;
      return data as Proyecto;
    },
  });
}

export function useCrearProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Proyecto>) => {
      const { data: created, error } = await supabase.from("Proyecto").insert(data).select(proyectoColumns).single();
      if (error) throw error;
      return created;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["proyectos"] }),
  });
}

export function useActualizarProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Proyecto> }) => {
      const { data: updated, error } = await supabase.from("Proyecto").update(data).eq("id", id).select(proyectoColumns).single();
      if (error) throw error;
      return updated as Proyecto;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.invalidateQueries({ queryKey: ["proyectos", variables.id] });
    },
  });
}

export function useEliminarProyecto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("Proyecto").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      queryClient.removeQueries({ queryKey: ["proyectos", id] });
      queryClient.invalidateQueries({ queryKey: ["tareas"] });
    },
  });
}