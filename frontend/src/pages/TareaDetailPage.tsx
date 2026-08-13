import { useState } from "react";
import { Alert, Anchor, Button, Group, Modal, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useProyectos } from "../api/proyectos";
import { useEliminarTarea, useTarea } from "../api/tareas";
import TareaStatusBadge from "../components/tareas/TareaStatusBadge";

function formatDate(value?: string) { return value ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—"; }

export default function TareaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tarea, isLoading, isError, refetch } = useTarea(id);
  const { data: proyectos = [] } = useProyectos();
  const { data: clientes = [] } = useClientes();
  const eliminar = useEliminarTarea();
  const [deleteOpened, setDeleteOpened] = useState(false);
  const proyecto = tarea ? proyectos.find((item) => item.id === tarea.proyectoId) : undefined;
  const cliente = proyecto ? clientes.find((item) => item.id === proyecto.clienteId) : undefined;

  if (isLoading) return <Stack className="task-detail-page" gap="lg"><Skeleton height={36} width="48%" /><Skeleton height={180} /><Skeleton height={120} /></Stack>;
  if (isError || !tarea) return <Stack className="task-detail-page"><Alert color="red" title="No se ha podido cargar la tarea" icon={<IconAlertCircle size={18} />}><Button variant="light" color="red" mt="sm" onClick={() => refetch()}>Reintentar</Button></Alert><Button component={Link} to="/tareas" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a tareas</Button></Stack>;

  const handleDelete = () => eliminar.mutate(tarea.id, { onSuccess: () => navigate("/tareas") });

  return <Stack className="task-detail-page" gap="lg"><Button component={Link} to="/tareas" variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>Volver a tareas</Button><Group justify="space-between" align="flex-start" wrap="wrap" gap="md"><Stack gap="xs"><Group gap="sm"><Title order={1}>{tarea.titulo}</Title><TareaStatusBadge status={tarea.estado} /></Group></Stack><Group gap="sm"><Button variant="light" leftSection={<IconEdit size={16} />} onClick={() => navigate(`/tareas/${tarea.id}/editar`)}>Editar</Button><Button variant="subtle" color="red" leftSection={<IconTrash size={16} />} onClick={() => setDeleteOpened(true)}>Eliminar</Button></Group></Group><Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Información de la tarea</Title><div className="task-detail-fields"><div><Text size="xs" c="dimmed">Proyecto</Text>{proyecto ? <Anchor component={Link} to={`/proyectos/${proyecto.id}`}>{proyecto.nombre}</Anchor> : <Text>—</Text>}</div><div><Text size="xs" c="dimmed">Cliente</Text>{cliente ? <Anchor component={Link} to={`/clientes/${cliente.id}`}>{cliente.empresa || cliente.nombre}</Anchor> : <Text>—</Text>}</div><div><Text size="xs" c="dimmed">Estado</Text><TareaStatusBadge status={tarea.estado} /></div><div><Text size="xs" c="dimmed">Fecha de creación</Text><Text>{formatDate(tarea.createdAt)}</Text></div></div></Stack></Paper><Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title="Eliminar tarea" size="sm"><Stack><Text size="sm">¿Seguro que quieres eliminar <strong>{tarea.titulo}</strong>?</Text><Group justify="flex-end"><Button variant="subtle" onClick={() => setDeleteOpened(false)}>Cancelar</Button><Button color="red" loading={eliminar.isPending} onClick={handleDelete}>Eliminar</Button></Group></Stack></Modal></Stack>;
}
