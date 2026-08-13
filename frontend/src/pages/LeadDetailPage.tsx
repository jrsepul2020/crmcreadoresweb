import { useState } from "react";
import { Alert, Anchor, Button, Group, Modal, Paper, Select, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconCheck, IconEdit, IconTrash, IconUserPlus } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { leadStatuses, useActualizarLead, useConvertirLead, useEliminarLead, useLead, type Lead } from "../api/leads";
import LeadForm, { type LeadFormValues } from "../components/leads/LeadForm";
import LeadStatusBadge from "../components/leads/LeadStatusBadge";
import { statusLabels } from "../components/leads/LeadStatusBadge";

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError, refetch } = useLead(id);
  const convertir = useConvertirLead();
  const actualizar = useActualizarLead();
  const eliminar = useEliminarLead();
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [convertOpened, setConvertOpened] = useState(false);
  const [message, setMessage] = useState("");

  if (isLoading) return <Stack className="lead-detail-page" gap="lg"><Skeleton height={36} width="42%" /><Skeleton height={18} width="58%" /><Skeleton height={220} /><Skeleton height={160} /></Stack>;
  if (isError || !lead) return <Stack className="lead-detail-page" gap="md"><Alert color="red" title="No se ha podido cargar el lead" icon={<IconAlertCircle size={18} />}><Button variant="light" color="red" mt="sm" onClick={() => refetch()}>Reintentar</Button></Alert><Button component={Link} to="/leads" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a leads</Button></Stack>;

  const converted = Boolean(lead.clienteId) || lead.estado === "convertido";
  const handleConvert = () => {
    setMessage("");
    convertir.mutate(lead, {
      onSuccess: () => {
        setConvertOpened(false);
        setMessage("Lead convertido correctamente en cliente.");
      },
      onError: () => setMessage("No se ha podido convertir el lead. No se ha marcado como convertido."),
    });
  };

  const handleStatusChange = (value: string | null) => {
    if (!value || value === "convertido") return;
    actualizar.mutate({ id: lead.id, data: { estado: value as Lead["estado"] } }, {
      onError: () => setMessage("No se ha podido cambiar el estado del lead."),
    });
  };

  const handleDelete = () => {
    eliminar.mutate(lead, {
      onSuccess: () => navigate("/leads"),
      onError: () => setMessage("Este lead está convertido y no se puede eliminar."),
    });
  };

  const handleEditSubmit = (values: LeadFormValues) => {
    actualizar.mutate({
      id: lead.id,
      data: {
        nombre: values.nombre.trim(),
        empresa: values.empresa.trim() || undefined,
        email: values.email.trim() || undefined,
        telefono: values.telefono.trim() || undefined,
        estado: values.estado,
        notas: values.notas.trim() || undefined,
      },
    }, {
      onSuccess: () => setEditOpened(false),
      onError: () => setMessage("No se ha podido guardar el lead."),
    });
  };

  return <Stack className="lead-detail-page" gap="lg">
    <Button component={Link} to="/leads" variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />} className="lead-back-link">Volver a leads</Button>
    <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
      <Stack gap="xs"><Group gap="sm"><Title order={1}>{lead.nombre}</Title><LeadStatusBadge status={lead.estado} /></Group><Text c="dimmed">{lead.empresa || "Sin empresa indicada"}</Text></Stack>
      <Group gap="sm" wrap="wrap"><Button variant="light" leftSection={<IconEdit size={16} />} onClick={() => setEditOpened(true)}>Editar</Button>{!converted && <Select aria-label="Cambiar estado" placeholder="Cambiar estado" value={lead.estado} data={leadStatuses.filter((status) => status !== "convertido").map((status) => ({ value: status, label: statusLabels[status] }))} onChange={handleStatusChange} w={180} />} {!converted && <Button leftSection={<IconUserPlus size={16} />} onClick={() => setConvertOpened(true)}>Convertir en cliente</Button>}<Button variant="subtle" color="red" leftSection={<IconTrash size={16} />} onClick={() => setDeleteOpened(true)}>Eliminar</Button></Group>
    </Group>
    {message && <Alert color={message.startsWith("Lead convertido") ? "green" : "red"} icon={message.startsWith("Lead convertido") ? <IconCheck size={18} /> : <IconAlertCircle size={18} />}>{message}</Alert>}
    <div className="lead-detail-grid">
      <Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Datos de contacto</Title><div className="lead-detail-fields"><div><Text size="xs" c="dimmed">Nombre</Text><Text fw={600}>{lead.nombre}</Text></div><div><Text size="xs" c="dimmed">Empresa</Text><Text>{lead.empresa || "—"}</Text></div><div><Text size="xs" c="dimmed">Email</Text><Text>{lead.email || "—"}</Text></div><div><Text size="xs" c="dimmed">Teléfono</Text><Text>{lead.telefono || "—"}</Text></div></div></Stack></Paper>
      <Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Información comercial</Title><div className="lead-detail-fields"><div><Text size="xs" c="dimmed">Estado actual</Text><LeadStatusBadge status={lead.estado} /></div><div><Text size="xs" c="dimmed">Fecha de creación</Text><Text>{formatDate(lead.createdAt)}</Text></div><div><Text size="xs" c="dimmed">Fecha de conversión</Text><Text>{formatDate(lead.fechaConversion)}</Text></div>{converted && lead.clienteId && <div><Text size="xs" c="dimmed">Cliente creado</Text><Anchor component={Link} to={`/clientes/${lead.clienteId}`}>Ver cliente</Anchor></div>}</div></Stack></Paper>
    </div>
    <Paper withBorder p="lg"><Stack gap="sm"><Title order={3}>Notas</Title><Text size="sm" style={{ whiteSpace: "pre-wrap" }}>{lead.notas || "—"}</Text></Stack></Paper>

    <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Editar lead" size="lg"><LeadForm lead={lead} loading={actualizar.isPending} onSubmit={handleEditSubmit} onCancel={() => setEditOpened(false)} /></Modal>
    <Modal opened={convertOpened} onClose={() => setConvertOpened(false)} title="Convertir lead en cliente" size="sm"><Stack><Text size="sm">Se creará un cliente con el nombre, email y teléfono disponibles y se marcará este lead como convertido.</Text><Group justify="flex-end"><Button variant="subtle" onClick={() => setConvertOpened(false)}>Cancelar</Button><Button loading={convertir.isPending} onClick={handleConvert}>Convertir en cliente</Button></Group></Stack></Modal>
    <Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title="Eliminar lead" size="sm"><Stack><Text size="sm">{converted ? "Este lead está convertido y no se puede eliminar porque está relacionado con un cliente." : <>¿Seguro que quieres eliminar a <strong>{lead.nombre}</strong>?</>}</Text><Group justify="flex-end"><Button variant="subtle" onClick={() => setDeleteOpened(false)}>Cancelar</Button>{!converted && <Button color="red" loading={eliminar.isPending} onClick={handleDelete}>Eliminar</Button>}</Group></Stack></Modal>
  </Stack>;
}
