import { Badge } from "@mantine/core";
import type { Proyecto } from "../../api/proyectos";

type ProyectoStatus = Proyecto["estado"];

const statusLabels: Record<ProyectoStatus, string> = {
  pendiente: "Pendiente",
  activo: "Activo",
  pausado: "Pausado",
  completado: "Completado",
  cancelado: "Cancelado",
};

const statusColors: Record<ProyectoStatus, string> = {
  pendiente: "yellow",
  activo: "green",
  pausado: "orange",
  completado: "green",
  cancelado: "red",
};

export default function ProyectoStatusBadge({ status }: { status: ProyectoStatus }) {
  return <Badge color={statusColors[status]} variant="light">{statusLabels[status]}</Badge>;
}

export { statusLabels };
