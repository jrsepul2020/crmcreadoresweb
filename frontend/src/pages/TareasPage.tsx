import { useDeferredValue, useMemo, useState } from "react";
import { Alert, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconChecklist } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useProyectos } from "../api/proyectos";
import { useEliminarTarea, useTareas } from "../api/tareas";
import TareasTable from "../components/tareas/TareasTable";
import TareasToolbar, { type TareasFilters } from "../components/tareas/TareasToolbar";

export default function TareasPage() {
  const navigate = useNavigate();
  const { data: tareas = [], isLoading, isError, refetch } = useTareas();
  const { data: proyectos = [] } = useProyectos();
  const { data: clientes = [] } = useClientes();
  const eliminar = useEliminarTarea();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TareasFilters>({ status: "todos", proyectoId: null });
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const projectRelations = useMemo(() => Object.fromEntries(proyectos.map((project) => { const client = clientes.find((item) => item.id === project.clienteId); return [project.id, { nombre: project.nombre, cliente: client?.empresa || client?.nombre || "—" }]; })), [clientes, proyectos]);
  const filtered = useMemo(() => tareas.filter((task) => { const relation = projectRelations[task.proyectoId]; return [task.titulo, relation?.nombre, relation?.cliente].some((value) => value?.toLowerCase().includes(deferredSearch)) && (filters.status === "todos" || task.estado === filters.status) && (!filters.proyectoId || task.proyectoId === filters.proyectoId); }), [deferredSearch, filters, projectRelations, tareas]);
  const confirmDelete = () => { if (deleteTaskId) eliminar.mutate(deleteTaskId, { onSuccess: () => setDeleteTaskId(null) }); };

  return <Stack className="tasks-page" gap="lg"><Group justify="space-between" align="flex-end" gap="md" wrap="wrap"><div><Title order={1}>Tareas</Title><Text c="dimmed" mt={6}>Organiza y controla el trabajo pendiente de tus proyectos.</Text></div><Button leftSection={<IconChecklist size={16} />} onClick={() => navigate("/tareas/nuevo")}>Nueva tarea</Button></Group><TareasToolbar search={search} filters={filters} count={filtered.length} proyectos={proyectos} onSearchChange={setSearch} onFiltersChange={setFilters} onCreate={() => navigate("/tareas/nuevo")} />{isError ? <Alert color="red" title="No se han podido cargar las tareas" icon={<IconAlertCircle size={18} />}><Group justify="space-between" mt="sm"><Text size="sm">Comprueba la conexión e inténtalo de nuevo.</Text><Button variant="light" color="red" size="compact-sm" onClick={() => refetch()}>Reintentar</Button></Group></Alert> : tareas.length === 0 && !isLoading ? <Paper className="clients-empty-state" withBorder p="xl"><Stack align="center" gap="xs"><IconChecklist size={30} stroke={1.5} color="var(--app-accent)" /><Text fw={650}>Sin tareas todavía</Text><Text size="sm" c="dimmed">Crea la primera tarea dentro de un proyecto.</Text><Button mt="sm" onClick={() => navigate("/tareas/nuevo")}>Nueva tarea</Button></Stack></Paper> : <TareasTable tareas={filtered} proyectos={projectRelations} loading={isLoading} onEdit={(task) => navigate(`/tareas/${task.id}/editar`)} onDelete={(task) => setDeleteTaskId(task.id)} />}{deleteTaskId && <Paper className="task-delete-confirm" withBorder p="md"><Group justify="space-between" wrap="wrap"><Text size="sm">¿Seguro que quieres eliminar esta tarea?</Text><Group><Button variant="subtle" onClick={() => setDeleteTaskId(null)}>Cancelar</Button><Button color="red" loading={eliminar.isPending} onClick={confirmDelete}>Eliminar</Button></Group></Group></Paper>}</Stack>;
}
