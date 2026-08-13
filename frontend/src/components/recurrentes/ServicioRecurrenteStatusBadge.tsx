import { Badge } from "@mantine/core";
import type { ServicioRecurrenteEstado } from "../../api/serviciosRecurrentes";

const labels: Record<ServicioRecurrenteEstado, string> = {
  activo: "Activo",
  pausado: "Pausado",
  cancelado: "Cancelado",
};

const colors: Record<ServicioRecurrenteEstado, string> = {
  activo: "green",
  pausado: "yellow",
  cancelado: "red",
};

export default function ServicioRecurrenteStatusBadge({ status }: { status: ServicioRecurrenteEstado }) {
  return <Badge color={colors[status]} variant="light">{labels[status]}</Badge>;
}

export { labels };
