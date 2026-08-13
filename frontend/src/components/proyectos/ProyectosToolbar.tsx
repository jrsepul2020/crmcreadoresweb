import { Button, Group, Menu, Select, Text, TextInput } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconPlus, IconSearch } from "@tabler/icons-react";
import type { Cliente } from "../../api/clientes";
import type { Proyecto } from "../../api/proyectos";
import { statusLabels } from "./ProyectoStatusBadge";

export interface ProyectosFilters {
  status: "todos" | Proyecto["estado"];
  clienteId: string | null;
}

interface ProyectosToolbarProps {
  search: string;
  filters: ProyectosFilters;
  count: number;
  clientes: Cliente[];
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: ProyectosFilters) => void;
  onCreate: () => void;
}

export default function ProyectosToolbar({ search, filters, count, clientes, onSearchChange, onFiltersChange, onCreate }: ProyectosToolbarProps) {
  const statusLabel = filters.status === "todos" ? "Todos" : statusLabels[filters.status];
  return <Group justify="space-between" align="center" gap="md" wrap="wrap" className="clients-toolbar project-toolbar">
    <Group gap="sm" wrap="wrap">
      <TextInput aria-label="Buscar proyectos" placeholder="Buscar proyectos..." value={search} onChange={(event) => onSearchChange(event.currentTarget.value)} leftSection={<IconSearch size={16} />} className="clients-search" />
      <Menu shadow="sm" position="bottom-start" withinPortal>
        <Menu.Target><Button variant="light" leftSection={<IconAdjustmentsHorizontal size={16} />}>Estado{filters.status !== "todos" ? `: ${statusLabel}` : ""}</Button></Menu.Target>
        <Menu.Dropdown><Menu.Label>Filtrar por estado</Menu.Label><Menu.Item onClick={() => onFiltersChange({ ...filters, status: "todos" })}>Todos</Menu.Item>{(Object.keys(statusLabels) as Proyecto["estado"][]).map((status) => <Menu.Item key={status} onClick={() => onFiltersChange({ ...filters, status })}>{statusLabels[status]}</Menu.Item>)}</Menu.Dropdown>
      </Menu>
      <Select aria-label="Filtrar por cliente" placeholder="Cliente" clearable searchable data={clientes.map((cliente) => ({ value: cliente.id, label: cliente.empresa || cliente.nombre }))} value={filters.clienteId} onChange={(clienteId) => onFiltersChange({ ...filters, clienteId })} className="project-client-filter" />
    </Group>
    <Group gap="md" ml="auto"><Text size="sm" c="dimmed">{count} {count === 1 ? "proyecto" : "proyectos"}</Text><Button leftSection={<IconPlus size={16} />} onClick={onCreate}>Nuevo proyecto</Button></Group>
  </Group>;
}
