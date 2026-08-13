import { Button, Group, Menu, Select, Text, TextInput } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconPlus, IconSearch } from "@tabler/icons-react";
import type { Proyecto } from "../../api/proyectos";
import type { Tarea } from "../../api/tareas";
import { statusLabels } from "./TareaStatusBadge";

export interface TareasFilters { status: "todos" | Tarea["estado"]; proyectoId: string | null }

interface Props { search: string; filters: TareasFilters; count: number; proyectos: Proyecto[]; onSearchChange: (value: string) => void; onFiltersChange: (filters: TareasFilters) => void; onCreate: () => void }

export default function TareasToolbar({ search, filters, count, proyectos, onSearchChange, onFiltersChange, onCreate }: Props) {
  return <Group justify="space-between" align="center" gap="md" wrap="wrap" className="clients-toolbar task-toolbar"><Group gap="sm" wrap="wrap"><TextInput aria-label="Buscar tareas" placeholder="Buscar tareas..." value={search} onChange={(event) => onSearchChange(event.currentTarget.value)} leftSection={<IconSearch size={16} />} className="clients-search" /><Menu shadow="sm" position="bottom-start" withinPortal><Menu.Target><Button variant="light" leftSection={<IconAdjustmentsHorizontal size={16} />}>Estado{filters.status !== "todos" ? `: ${statusLabels[filters.status]}` : ""}</Button></Menu.Target><Menu.Dropdown><Menu.Label>Filtrar por estado</Menu.Label><Menu.Item onClick={() => onFiltersChange({ ...filters, status: "todos" })}>Todos</Menu.Item>{(Object.keys(statusLabels) as Tarea["estado"][]).map((status) => <Menu.Item key={status} onClick={() => onFiltersChange({ ...filters, status })}>{statusLabels[status]}</Menu.Item>)}</Menu.Dropdown></Menu><Select aria-label="Filtrar por proyecto" placeholder="Proyecto" clearable searchable data={proyectos.map((project) => ({ value: project.id, label: project.nombre }))} value={filters.proyectoId} onChange={(proyectoId) => onFiltersChange({ ...filters, proyectoId })} className="task-project-filter" /></Group><Group gap="md" ml="auto"><Text size="sm" c="dimmed">{count} {count === 1 ? "tarea" : "tareas"}</Text><Button leftSection={<IconPlus size={16} />} onClick={onCreate}>Nueva tarea</Button></Group></Group>;
}
