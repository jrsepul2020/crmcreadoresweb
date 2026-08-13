import { useState } from "react";
import { Alert, Anchor, Button, Group, Modal, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useProductos } from "../api/productos";
import { useEliminarServicioRecurrente, useServicioRecurrente } from "../api/serviciosRecurrentes";
import ServicioRecurrenteStatusBadge from "../components/recurrentes/ServicioRecurrenteStatusBadge";

function formatDate(value?: string) { return value ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`)) : "—"; }
function renewalState(value: string) { const days = Math.ceil((new Date(`${value}T00:00:00`).getTime() - new Date().setHours(0, 0, 0, 0)) / 86400000); return days < 0 ? { days, label: "Vencido", color: "red" } : days <= 30 ? { days, label: "Renovación próxima", color: "yellow" } : { days, label: `${days} días restantes`, color: "green" }; }

export default function ServicioRecurrenteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: servicio, isLoading, isError, refetch } = useServicioRecurrente(id);
  const { data: clientes = [] } = useClientes();
  const { data: productos = [] } = useProductos();
  const eliminar = useEliminarServicioRecurrente();
  const [deleteOpened, setDeleteOpened] = useState(false);
  const cliente = servicio ? clientes.find((item) => item.id === servicio.clienteId) : undefined;
  const producto = servicio?.productoId ? productos.find((item) => item.id === servicio.productoId) : undefined;

  if (isLoading) return <Stack className="recurring-detail-page"><Skeleton height={36} width="48%" /><Skeleton height={180} /><Skeleton height={140} /></Stack>;
  if (isError || !servicio) return <Stack className="recurring-detail-page"><Alert color="red" title="No se ha podido cargar el servicio recurrente" icon={<IconAlertCircle size={18} />}><Button variant="light" color="red" mt="sm" onClick={() => refetch()}>Reintentar</Button></Alert><Button component={Link} to="/recurrentes" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a servicios</Button></Stack>;

  const renewal = renewalState(servicio.proximaRenovacion);
  const handleDelete = () => eliminar.mutate(servicio.id, { onSuccess: () => navigate("/recurrentes") });

  return <Stack className="recurring-detail-page" gap="lg"><Button component={Link} to="/recurrentes" variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>Volver a servicios</Button><Group justify="space-between" align="flex-start" gap="md" wrap="wrap"><Stack gap="xs"><Group gap="sm"><Title order={1}>{servicio.descripcion}</Title><ServicioRecurrenteStatusBadge status={servicio.estado} /></Group><Text c="dimmed">{cliente?.empresa || cliente?.nombre || "Cliente no disponible"}</Text></Stack><Group><Button variant="light" leftSection={<IconEdit size={16} />} onClick={() => navigate(`/recurrentes/${servicio.id}/editar`)}>Editar</Button><Button variant="subtle" color="red" leftSection={<IconTrash size={16} />} onClick={() => setDeleteOpened(true)}>Eliminar</Button></Group></Group><Paper className="renewal-highlight" withBorder p="lg"><Stack gap="xs"><Text size="xs" fw={700} tt="uppercase" c="dimmed">Próxima renovación</Text><Text size="xl" fw={700}>{formatDate(servicio.proximaRenovacion)}</Text><Text c={renewal.color === "red" ? "red" : renewal.color === "yellow" ? "orange" : "green"}>{renewal.label}</Text></Stack></Paper><Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Información del servicio</Title><div className="recurring-detail-fields"><div><Text size="xs" c="dimmed">Cliente</Text>{cliente ? <Anchor component={Link} to={`/clientes/${cliente.id}`}>{cliente.empresa || cliente.nombre}</Anchor> : <Text>—</Text>}</div><div><Text size="xs" c="dimmed">Producto origen</Text><Text>{producto?.nombre || "—"}</Text></div><div><Text size="xs" c="dimmed">Descripción</Text><Text>{servicio.descripcion}</Text></div><div><Text size="xs" c="dimmed">Precio</Text><Text>{Number(servicio.precio).toFixed(2)} €</Text></div><div><Text size="xs" c="dimmed">Periodicidad</Text><Text>{servicio.periodicidad}</Text></div><div><Text size="xs" c="dimmed">Fecha de inicio</Text><Text>{formatDate(servicio.fechaInicio)}</Text></div><div><Text size="xs" c="dimmed">Estado</Text><ServicioRecurrenteStatusBadge status={servicio.estado} /></div><div><Text size="xs" c="dimmed">Fecha de creación</Text><Text>{formatDate(servicio.createdAt)}</Text></div></div></Stack></Paper><Paper withBorder p="lg"><Stack gap="sm"><Title order={3}>Notas</Title><Text size="sm" c={servicio.notas ? undefined : "dimmed"} style={{ whiteSpace: "pre-wrap" }}>{servicio.notas || "No hay notas para este servicio."}</Text></Stack></Paper><Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title="Eliminar servicio recurrente" size="sm"><Stack><Text size="sm">¿Seguro que quieres eliminar <strong>{servicio.descripcion}</strong>?</Text><Group justify="flex-end"><Button variant="subtle" onClick={() => setDeleteOpened(false)}>Cancelar</Button><Button color="red" loading={eliminar.isPending} onClick={handleDelete}>Eliminar</Button></Group></Stack></Modal></Stack>;
}
