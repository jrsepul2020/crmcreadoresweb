import { Badge } from "@mantine/core";
import type { LeadStatus } from "../../api/leads";

const statusLabels: Record<LeadStatus, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  propuesta_enviada: "Propuesta enviada",
  convertido: "Convertido",
  perdido: "Perdido",
};

const statusColors: Record<LeadStatus, string> = {
  nuevo: "gray",
  contactado: "blue",
  calificado: "primary",
  propuesta_enviada: "blue",
  convertido: "green",
  perdido: "red",
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge color={statusColors[status]} variant="light">{statusLabels[status]}</Badge>;
}

export { statusLabels };
