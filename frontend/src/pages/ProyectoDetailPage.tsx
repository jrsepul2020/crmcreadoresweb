import { useMemo, useState } from "react";
import { Alert, Anchor, Button, Group, Modal, Paper, Skeleton, Stack, Table, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconChecklist, IconEdit, IconFileInvoice, IconPlus, IconTrash } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useProyecto, useEliminarProyecto } from "../api/proyectos";
import { useTareas } from "../api/tareas";
import ProyectoStatusBadge from "../components/proyectos/ProyectoStatusBadge";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default function ProyectoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: proyecto, isLoading, isError, refetch } = useProyecto(id);
  const { data: clientes = [] } = useClientes();
  const { data: tareas = [], isLoading: tasksLoading } = useTareas();
  const eliminar = useEliminarProyecto();
  const [deleteOpened, setDeleteOpened] = useState(false);
  const cliente = proyecto ? clientes.find((item) => item.id === proyecto.clienteId) : undefined;
  const relatedTasks = useMemo(() => tareas.filter((task) => task.proyectoId === id), [id, tareas]);

  if (isLoading) return <Stack className="project-detail-page" gap="lg"><Skeleton height={36} width="48%" /><Skeleton height={18} width="32%" /><Skeleton height={220} /><Skeleton height={160} /></Stack>;
  if (isError || !proyecto) return <Stack className="project-detail-page" gap="md"><Alert color="red" title="No se ha podido cargar el proyecto" icon={<IconAlertCircle size={18} />}><Button variant="light" color="red" mt="sm" onClick={() => refetch()}>Reintentar</Button></Alert><Button component={Link} to="/proyectos" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a proyectos</Button></Stack>;

  const handleDelete = () => {
    eliminar.mutate(proyecto.id, { onSuccess: () => navigate("/proyectos") });
  };

  return <Stack className="project-detail-page" gap="lg">
    <Button component={Link} to="/proyectos" variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>Volver a proyectos</Button>
    <Group justify="space-between" align="flex-start" gap="md" wrap="wrap"><Stack gap="xs"><Group gap="sm"><Title order={1}>{proyecto.nombre}</Title><ProyectoStatusBadge status={proyecto.estado} /></Group><Text c="dimmed">{cliente?.empresa || cliente?.nombre || "Cliente no disponible"}</Text></Stack><Group gap="sm"><Button variant="light" leftSection={<IconEdit size={16} />} onClick={() => navigate(`/proyectos/${proyecto.id}/editar`)}>Editar</Button><Button variant="subtle" color="red" leftSection={<IconTrash size={16} />} onClick={() => setDeleteOpened(true)}>Eliminar</Button></Group></Group>
    <Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Información del proyecto</Title><div className="project-detail-fields"><div><Text size="xs" c="dimmed">Cliente</Text>{cliente ? <Anchor component={Link} to={`/clientes/${cliente.id}`}>{cliente.empresa || cliente.nombre}</Anchor> : <Text>—</Text>}</div><div><Text size="xs" c="dimmed">Estado</Text><ProyectoStatusBadge status={proyecto.estado} /></div><div><Text size="xs" c="dimmed">Fecha de inicio</Text><Text>{formatDate(proyecto.fechaInicio)}</Text></div><div><Text size="xs" c="dimmed">Fecha prevista</Text><Text>{formatDate(proyecto.fechaPrevista)}</Text></div><div><Text size="xs" c="dimmed">Fecha de creación</Text><Text>{formatDate(proyecto.createdAt)}</Text></div></div></Stack></Paper>
    <Paper withBorder p="lg"><Stack gap="sm"><Title order={3}>Notas</Title><Text size="sm" c={proyecto.notas ? undefined : "dimmed"} style={{ whiteSpace: "pre-wrap" }}>{proyecto.notas || "No hay notas para este proyecto."}</Text></Stack></Paper>
    <Paper withBorder p="lg"><Stack gap="md"><Group justify="space-between"><Group gap="sm"><IconChecklist size={20} color="var(--app-accent)" /><Title order={3}>Tareas</Title><Text size="sm" c="dimmed">{tasksLoading ? "—" : relatedTasks.length}</Text></Group><Button variant="light" size="compact-sm" leftSection={<IconPlus size={15} />} component={Link} to={`/tareas/nuevo?proyectoId=${proyecto.id}`}>Nueva tarea</Button></Group>{tasksLoading ? <Skeleton height={48} /> : relatedTasks.length ? <Table><Table.Thead><Table.Tr><Table.Th>Título</Table.Th><Table.Th>Estado</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{relatedTasks.map((task) => <Table.Tr key={task.id}><Table.Td><Anchor component={Link} to={`/tareas/${task.id}`}>{task.titulo}</Anchor></Table.Td><Table.Td>{task.estado}</Table.Td></Table.Tr>)}</Table.Tbody></Table> : <Text size="sm" c="dimmed">Todavía no hay tareas para este proyecto.</Text>}</Stack></Paper>
    <Paper withBorder p="lg"><Stack gap="sm"><Group gap="sm"><IconFileInvoice size={20} color="var(--app-accent)" /><Title order={3}>Presupuesto</Title></Group><Text size="sm" c="dimmed">La relación con presupuestos estará disponible cuando se implemente este flujo.</Text></Stack></Paper>
    <Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title="Eliminar proyecto" size="sm"><Stack><Text size="sm">¿Seguro que quieres eliminar <strong>{proyecto.nombre}</strong>? Esta acción no se puede deshacer.</Text><Group justify="flex-end"><Button variant="subtle" onClick={() => setDeleteOpened(false)}>Cancelar</Button><Button color="red" loading={eliminar.isPending} onClick={handleDelete}>Eliminar</Button></Group></Stack></Modal>
  </Stack>;
}
