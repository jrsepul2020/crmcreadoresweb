import { Badge } from "@mantine/core";
import type { Tarea } from "../../api/tareas";

type TareaStatus = Tarea["estado"];

const statusLabels: Record<TareaStatus, string> = {
  pendiente: "Pendiente",
  en_progreso: "En progreso",
  bloqueada: "Bloqueada",
  completada: "Completada",
  cancelada: "Cancelada",
};

const statusColors: Record<TareaStatus, string> = {
  pendiente: "gray",
  en_progreso: "primary",
  bloqueada: "yellow",
  completada: "green",
  cancelada: "red",
};

export default function TareaStatusBadge({ status }: { status: TareaStatus }) {
  return <Badge color={statusColors[status]} variant="light">{statusLabels[status]}</Badge>;
}

export { statusLabels };
