import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export const leadStatuses = [
  "nuevo",
  "contactado",
  "calificado",
  "propuesta_enviada",
  "convertido",
  "perdido",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export interface Lead {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  notas?: string;
  estado: LeadStatus;
  createdAt?: string;
  fechaConversion?: string;
  clienteId?: string;
}

const leadColumns = "id,nombre,email,telefono,empresa,notas,estado,createdAt,fechaConversion,clienteId";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Lead")
        .select(leadColumns)
        .order("createdAt", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: ["leads", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Lead")
        .select(leadColumns)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Lead;
    },
  });
}

function invalidateLeadQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["leads"] });
  queryClient.invalidateQueries({ queryKey: ["clientes"] });
}

export function useCrearLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      const { data: created, error } = await supabase
        .from("Lead")
        .insert(data)
        .select(leadColumns)
        .single();
      if (error) throw error;
      return created as Lead;
    },
    onSuccess: () => invalidateLeadQueries(queryClient),
  });
}

export function useActualizarLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> }) => {
      const { data: updated, error } = await supabase
        .from("Lead")
        .update(data)
        .eq("id", id)
        .select(leadColumns)
        .single();
      if (error) throw error;
      return updated as Lead;
    },
    onSuccess: (_data, variables) => {
      invalidateLeadQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["leads", variables.id] });
    },
  });
}

export function useEliminarLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lead: Lead) => {
      if (lead.clienteId || lead.estado === "convertido") {
        throw new Error("Un lead convertido no se puede eliminar.");
      }
      const { error } = await supabase.from("Lead").delete().eq("id", lead.id);
      if (error) throw error;
    },
    onSuccess: () => invalidateLeadQueries(queryClient),
  });
}

export function useConvertirLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lead: Lead) => {
      if (lead.clienteId || lead.estado === "convertido") {
        return { lead, clienteId: lead.clienteId };
      }

      const { data: cliente, error: clienteError } = await supabase
        .from("Cliente")
        .insert({
          nombre: lead.nombre,
          email: lead.email,
          telefono: lead.telefono,
        })
        .select("id")
        .single();
      if (clienteError) throw clienteError;

      const { data: updatedLead, error: leadError } = await supabase
        .from("Lead")
        .update({
          estado: "convertido",
          fechaConversion: new Date().toISOString(),
          clienteId: cliente.id,
        })
        .eq("id", lead.id)
        .is("clienteId", null)
        .neq("estado", "convertido")
        .select(leadColumns)
        .single();

      if (leadError) {
        await supabase.from("Cliente").delete().eq("id", cliente.id);
        throw leadError;
      }

      return { lead: updatedLead as Lead, clienteId: cliente.id };
    },
    onSuccess: (_data, lead) => {
      invalidateLeadQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ["leads", lead.id] });
    },
  });
}

