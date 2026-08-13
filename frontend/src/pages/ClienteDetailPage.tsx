import { useMemo, useState } from "react";
import { Alert, Anchor, Button, Group, Menu, Modal, Paper, Skeleton, Stack, Table, Tabs, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft, IconChecklist, IconDots, IconEdit, IconFileInvoice, IconFolder, IconPlus, IconReceipt } from "@tabler/icons-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useActualizarCliente, useClientes } from "../api/clientes";
import { usePresupuestos } from "../api/presupuestos";
import { useProyectos } from "../api/proyectos";
import { useTareas } from "../api/tareas";
import { useServiciosRecurrentes } from "../api/serviciosRecurrentes";
import ServicioRecurrenteStatusBadge from "../components/recurrentes/ServicioRecurrenteStatusBadge";
import ClienteForm, { type ClienteFormValues } from "../components/clientes/ClienteForm";

const tabs = [
  { value: "resumen", label: "Resumen", icon: IconFolder },
  { value: "proyectos", label: "Proyectos", icon: IconFolder },
  { value: "presupuestos", label: "Presupuestos", icon: IconFileInvoice },
  { value: "facturas", label: "Facturas", icon: IconReceipt },
  { value: "tareas", label: "Tareas", icon: IconChecklist },
  { value: "cobros", label: "Cobros", icon: IconFileInvoice },
] as const;

type ClientTab = (typeof tabs)[number]["value"];

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function EmptyTab({ title, message, icon: Icon }: { title: string; message: string; icon: typeof IconFolder }) {
  return <Paper className="client-tab-empty" withBorder p="xl"><Stack align="center" gap="xs"><Icon size={28} stroke={1.5} color="var(--app-accent)" /><Text fw={650} mt="xs">{title}</Text><Text size="sm" c="dimmed" ta="center">{message}</Text></Stack></Paper>;
}

function ClientProjectsTab({ clienteId }: { clienteId: string }) {
  const { data: proyectos = [], isLoading, isError } = useProyectos();
  const related = proyectos.filter((project) => project.clienteId === clienteId);
  if (isLoading) return <Stack>{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} height={48} />)}</Stack>;
  if (isError) return <Alert color="red" icon={<IconAlertCircle size={18} />}>No se han podido cargar los proyectos.</Alert>;
  if (!related.length) return <EmptyTab title="No hay proyectos" message="Los proyectos relacionados con este cliente aparecerán aquí." icon={IconFolder} />;
  return <Paper withBorder className="client-related-table"><Table><Table.Thead><Table.Tr><Table.Th>Nombre</Table.Th><Table.Th>Estado</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{related.map((project) => <Table.Tr key={project.id}><Table.Td fw={600}>{project.nombre}</Table.Td><Table.Td>{project.estado}</Table.Td></Table.Tr>)}</Table.Tbody></Table></Paper>;
}

function ClientBudgetsTab({ clienteId }: { clienteId: string }) {
  const { data: presupuestos = [], isLoading, isError } = usePresupuestos();
  const related = presupuestos.filter((budget) => budget.clienteId === clienteId);
  if (isLoading) return <Stack>{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} height={48} />)}</Stack>;
  if (isError) return <Alert color="red" icon={<IconAlertCircle size={18} />}>No se han podido cargar los presupuestos.</Alert>;
  if (!related.length) return <EmptyTab title="No hay presupuestos" message="Los presupuestos de este cliente aparecerán aquí cuando estén disponibles." icon={IconFileInvoice} />;
  return <Paper withBorder className="client-related-table"><Table><Table.Thead><Table.Tr><Table.Th>Número</Table.Th><Table.Th>Estado</Table.Th><Table.Th>Total</Table.Th><Table.Th>Fecha</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{related.map((budget) => <Table.Tr key={budget.id}><Table.Td fw={600}>{budget.numero}</Table.Td><Table.Td>{budget.estado}</Table.Td><Table.Td>{budget.total} €</Table.Td><Table.Td>—</Table.Td></Table.Tr>)}</Table.Tbody></Table></Paper>;
}

function ClientTasksTab({ clienteId }: { clienteId: string }) {
  const { data: proyectos = [], isLoading: projectsLoading } = useProyectos();
  const { data: tareas = [], isLoading: tasksLoading } = useTareas();
  const projectIds = useMemo(() => new Set(proyectos.filter((project) => project.clienteId === clienteId).map((project) => project.id)), [clienteId, proyectos]);
  const related = tareas.filter((task) => projectIds.has(task.proyectoId));
  if (projectsLoading || tasksLoading) return <Stack>{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} height={48} />)}</Stack>;
  if (!related.length) return <EmptyTab title="No hay tareas" message="Las tareas de los proyectos de este cliente aparecerán aquí." icon={IconChecklist} />;
  return <Paper withBorder className="client-related-table"><Table><Table.Thead><Table.Tr><Table.Th>Título</Table.Th><Table.Th>Estado</Table.Th><Table.Th>Proyecto</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{related.map((task) => <Table.Tr key={task.id}><Table.Td fw={600}>{task.titulo}</Table.Td><Table.Td>{task.estado}</Table.Td><Table.Td>{task.proyectoId}</Table.Td></Table.Tr>)}</Table.Tbody></Table></Paper>;
}

function ClientRecurringServices({ clienteId }: { clienteId: string }) {
  const { data: services = [], isLoading } = useServiciosRecurrentes();
  const related = services.filter((service) => service.clienteId === clienteId);
  if (isLoading) return <Skeleton height={56} />;
  return <Paper withBorder p="lg"><Stack gap="md"><Group justify="space-between" align="center"><Title order={3}>Servicios recurrentes</Title><Button component={Link} to={`/recurrentes/nuevo?clienteId=${clienteId}`} size="compact-sm" variant="light" leftSection={<IconPlus size={15} />}>Nuevo servicio recurrente</Button></Group>{related.length ? <Table><Table.Thead><Table.Tr><Table.Th>Servicio</Table.Th><Table.Th>Periodicidad</Table.Th><Table.Th>Precio</Table.Th><Table.Th>Renovación</Table.Th><Table.Th>Estado</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{related.map((service) => <Table.Tr key={service.id}><Table.Td><Anchor component={Link} to={`/recurrentes/${service.id}`}>{service.descripcion}</Anchor></Table.Td><Table.Td>{service.periodicidad}</Table.Td><Table.Td>{Number(service.precio).toFixed(2)} €</Table.Td><Table.Td>{formatDate(service.proximaRenovacion)}</Table.Td><Table.Td><ServicioRecurrenteStatusBadge status={service.estado} /></Table.Td></Table.Tr>)}</Table.Tbody></Table> : <Text size="sm" c="dimmed">Este cliente todavía no tiene servicios recurrentes.</Text>}</Stack></Paper>;
}

export default function ClienteDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: clientes = [], isLoading, isError, refetch } = useClientes();
  const actualizar = useActualizarCliente();
  const [editOpened, setEditOpened] = useState(false);
  const cliente = clientes.find((item) => item.id === id);
  const segment = location.pathname.split("/").at(-1);
  const activeTab: ClientTab = tabs.some((tab) => tab.value === segment) ? segment as ClientTab : "resumen";

  if (isLoading) return <Stack className="client-detail-page" gap="lg"><Skeleton height={36} width="42%" /><Skeleton height={18} width="58%" /><Skeleton height={180} /><Skeleton height={120} /></Stack>;
  if (isError) return <Stack className="client-detail-page"><Alert color="red" icon={<IconAlertCircle size={18} />} title="No se ha podido cargar el cliente"><Button variant="light" color="red" mt="sm" onClick={() => refetch()}>Reintentar</Button></Alert></Stack>;
  if (!cliente) return <Stack className="client-detail-page"><Text>Cliente no encontrado.</Text><Button component={Link} to="/clientes" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a clientes</Button></Stack>;

  const handleEdit = (values: ClienteFormValues) => {
    actualizar.mutate({ id: cliente.id, data: {
      nombre: values.nombre.trim(),
      personaContacto: values.personaContacto.trim() || undefined,
      empresa: values.empresa.trim() || undefined,
      email: values.email.trim() || undefined,
      telefono: values.telefono.trim() || undefined,
      nif: values.nif.trim().toUpperCase() || undefined,
      direccion: values.direccion.trim() || undefined,
      codigoPostal: values.codigoPostal.trim() || undefined,
      poblacion: values.poblacion.trim() || undefined,
      provincia: values.provincia.trim() || undefined,
      notas: values.notas.trim() || undefined,
    } }, { onSuccess: () => setEditOpened(false) });
  };

  const goToTab = (value: string | null) => {
    if (value) navigate(value === "resumen" ? `/clientes/${cliente.id}` : `/clientes/${cliente.id}/${value}`);
  };

  return <Stack className="client-detail-page" gap="lg">
    <Button component={Link} to="/clientes" variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>Volver a clientes</Button>
    <Group justify="space-between" align="flex-start" gap="md" wrap="wrap"><Stack gap="xs"><Title order={1}>{cliente.empresa || cliente.nombre}</Title><Text c="dimmed">{cliente.empresa ? cliente.nombre : cliente.nif || "Ficha del cliente"}</Text>{cliente.empresa && cliente.nif && <Text size="sm" c="dimmed">{cliente.nif}</Text>}</Stack><Group gap="sm"><Button variant="light" leftSection={<IconEdit size={16} />} onClick={() => setEditOpened(true)}>Editar cliente</Button><Menu shadow="sm" position="bottom-end"><Menu.Target><Button variant="subtle" color="gray" rightSection={<IconDots size={16} />}>Más acciones</Button></Menu.Target><Menu.Dropdown><Menu.Item disabled>Acciones adicionales próximamente</Menu.Item></Menu.Dropdown></Menu></Group></Group>
    <Tabs value={activeTab} onChange={goToTab} className="client-detail-tabs" keepMounted={false}><Tabs.List>{tabs.map(({ value, label, icon: Icon }) => <Tabs.Tab key={value} value={value} leftSection={<Icon size={16} />}>{label}</Tabs.Tab>)}</Tabs.List>
      <Tabs.Panel value="resumen" pt="lg"><Stack gap="md"><div className="client-summary-grid"><Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Datos del cliente</Title><div className="client-detail-fields"><div><Text size="xs" c="dimmed">Empresa</Text><Text>{cliente.empresa || "—"}</Text></div><div><Text size="xs" c="dimmed">Persona de contacto</Text><Text>{cliente.personaContacto || "—"}</Text></div><div><Text size="xs" c="dimmed">Nombre</Text><Text>{cliente.nombre}</Text></div><div><Text size="xs" c="dimmed">NIF / CIF</Text><Text>{cliente.nif || "—"}</Text></div><div><Text size="xs" c="dimmed">Email</Text><Text>{cliente.email || "—"}</Text></div><div><Text size="xs" c="dimmed">Teléfono</Text><Text>{cliente.telefono || "—"}</Text></div></div></Stack></Paper><Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Datos de facturación</Title><div className="client-detail-fields"><div><Text size="xs" c="dimmed">Dirección</Text><Text>{cliente.direccion || "—"}</Text></div><div><Text size="xs" c="dimmed">Código postal</Text><Text>{cliente.codigoPostal || "—"}</Text></div><div><Text size="xs" c="dimmed">Población</Text><Text>{cliente.poblacion || "—"}</Text></div><div><Text size="xs" c="dimmed">Provincia</Text><Text>{cliente.provincia || "—"}</Text></div></div></Stack></Paper></div><Paper withBorder p="lg"><Stack gap="md"><Title order={3}>Información</Title><div className="client-detail-fields client-info-grid"><div><Text size="xs" c="dimmed">Fecha de alta</Text><Text>{formatDate(cliente.createdAt)}</Text></div><div><Text size="xs" c="dimmed">Proyectos</Text><Text>Sin datos</Text></div><div><Text size="xs" c="dimmed">Presupuestos</Text><Text>Sin datos</Text></div><div><Text size="xs" c="dimmed">Total cobrado</Text><Text>Sin datos</Text></div></div></Stack></Paper><Paper withBorder p="lg"><Stack gap="sm"><Title order={3}>Notas</Title><Text size="sm" c={cliente.notas ? undefined : "dimmed"} style={{ whiteSpace: "pre-wrap" }}>{cliente.notas || "No hay notas para este cliente."}</Text></Stack></Paper><ClientRecurringServices clienteId={cliente.id} /></Stack></Tabs.Panel>
      <Tabs.Panel value="proyectos" pt="lg"><ClientProjectsTab clienteId={cliente.id} /></Tabs.Panel><Tabs.Panel value="presupuestos" pt="lg"><ClientBudgetsTab clienteId={cliente.id} /></Tabs.Panel><Tabs.Panel value="facturas" pt="lg"><EmptyTab title="No hay facturas disponibles" message="La facturación se integrará en este espacio posteriormente." icon={IconReceipt} /></Tabs.Panel><Tabs.Panel value="tareas" pt="lg"><ClientTasksTab clienteId={cliente.id} /></Tabs.Panel><Tabs.Panel value="cobros" pt="lg"><EmptyTab title="No hay cobros disponibles" message="Los cobros de este cliente aparecerán aquí cuando estén disponibles." icon={IconFileInvoice} /></Tabs.Panel>
    </Tabs>
    <Modal opened={editOpened} onClose={() => setEditOpened(false)} title="Editar cliente" size="md"><ClienteForm cliente={cliente} loading={actualizar.isPending} onSubmit={handleEdit} onCancel={() => setEditOpened(false)} /></Modal>
  </Stack>;
}
