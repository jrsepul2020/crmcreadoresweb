import { useDeferredValue, useMemo, useState } from "react";
import { Alert, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconFolderPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useEliminarProyecto, useProyectos } from "../api/proyectos";
import { useTareas } from "../api/tareas";
import ProyectosTable from "../components/proyectos/ProyectosTable";
import ProyectosToolbar, { type ProyectosFilters } from "../components/proyectos/ProyectosToolbar";

export default function ProyectosPage() {
  const navigate = useNavigate();
  const { data: proyectos = [], isLoading, isError, refetch } = useProyectos();
  const { data: clientes = [] } = useClientes();
  const { data: tareas = [] } = useTareas();
  const eliminar = useEliminarProyecto();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProyectosFilters>({ status: "todos", clienteId: null });
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const clienteNames = useMemo(() => Object.fromEntries(clientes.map((cliente) => [cliente.id, cliente.empresa || cliente.nombre])), [clientes]);
  const taskCounts = useMemo(() => tareas.reduce<Record<string, number>>((counts, tarea) => ({ ...counts, [tarea.proyectoId]: (counts[tarea.proyectoId] || 0) + 1 }), {}), [tareas]);
  const filtered = useMemo(() => proyectos.filter((proyecto) => {
    const clientName = clienteNames[proyecto.clienteId] || "";
    const matchesSearch = [proyecto.nombre, clientName].some((value) => value.toLowerCase().includes(deferredSearch));
    return matchesSearch && (filters.status === "todos" || proyecto.estado === filters.status) && (!filters.clienteId || proyecto.clienteId === filters.clienteId);
  }), [clienteNames, deferredSearch, filters, proyectos]);

  const confirmDelete = () => {
    if (!deleteProjectId) return;
    eliminar.mutate(deleteProjectId, { onSuccess: () => setDeleteProjectId(null) });
  };

  return <Stack className="projects-page" gap="lg">
    <Group justify="space-between" align="flex-end" gap="md" wrap="wrap"><div><Title order={1}>Proyectos</Title><Text c="dimmed" mt={6}>Gestiona los proyectos y trabajos de tus clientes.</Text></div><Button leftSection={<IconFolderPlus size={16} />} onClick={() => navigate("/proyectos/nuevo")}>Nuevo proyecto</Button></Group>
    <ProyectosToolbar search={search} filters={filters} count={filtered.length} clientes={clientes} onSearchChange={setSearch} onFiltersChange={setFilters} onCreate={() => navigate("/proyectos/nuevo")} />
    {isError ? <Alert color="red" title="No se han podido cargar los proyectos" icon={<IconAlertCircle size={18} />}><Group justify="space-between" mt="sm"><Text size="sm">Comprueba la conexión e inténtalo de nuevo.</Text><Button variant="light" color="red" size="compact-sm" onClick={() => refetch()}>Reintentar</Button></Group></Alert>
      : proyectos.length === 0 && !isLoading ? <Paper className="clients-empty-state" withBorder p="xl"><Stack align="center" gap="xs"><IconFolderPlus size={30} stroke={1.5} color="var(--app-accent)" /><Text fw={650} mt="xs">Sin proyectos todavía</Text><Text size="sm" c="dimmed" ta="center">Crea el primer proyecto para comenzar a organizar el trabajo de tus clientes.</Text><Button mt="sm" onClick={() => navigate("/proyectos/nuevo")}>Nuevo proyecto</Button></Stack></Paper>
      : <ProyectosTable proyectos={filtered} clientes={clienteNames} tareas={taskCounts} loading={isLoading} onEdit={(proyecto) => navigate(`/proyectos/${proyecto.id}/editar`)} onDelete={(proyecto) => setDeleteProjectId(proyecto.id)} />}
    {deleteProjectId && <Paper className="project-delete-confirm" withBorder p="md"><Group justify="space-between" wrap="wrap"><Text size="sm">¿Seguro que quieres eliminar este proyecto?</Text><Group><Button variant="subtle" onClick={() => setDeleteProjectId(null)}>Cancelar</Button><Button color="red" loading={eliminar.isPending} onClick={confirmDelete}>Eliminar</Button></Group></Group></Paper>}
  </Stack>;
}
