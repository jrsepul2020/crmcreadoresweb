import { useDeferredValue, useMemo, useState } from "react";
import { Alert, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useProductos } from "../api/productos";
import { useEliminarServicioRecurrente, useServiciosRecurrentes } from "../api/serviciosRecurrentes";
import ServiciosRecurrentesTable from "../components/recurrentes/ServiciosRecurrentesTable";
import ServiciosRecurrentesToolbar from "../components/recurrentes/ServiciosRecurrentesToolbar";

export default function ServiciosRecurrentesPage() {
  const navigate = useNavigate();
  const { data: servicios = [], isLoading, isError, refetch } = useServiciosRecurrentes();
  const { data: clientes = [] } = useClientes();
  const { data: productos = [] } = useProductos();
  const eliminar = useEliminarServicioRecurrente();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"todos" | "activo" | "pausado" | "cancelado">("todos");
  const [periodicidad, setPeriodicidad] = useState<"todas" | "mensual" | "trimestral" | "anual">("todas");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const clienteNames = useMemo(() => Object.fromEntries(clientes.map((client) => [client.id, client.empresa || client.nombre])), [clientes]);
  const productNames = useMemo(() => Object.fromEntries(productos.map((product) => [product.id, product.nombre])), [productos]);
  const filtered = useMemo(() => servicios.filter((item) => { const client = clienteNames[item.clienteId] || ""; return [item.descripcion, client].some((value) => value.toLowerCase().includes(deferredSearch)) && (status === "todos" || item.estado === status) && (periodicidad === "todas" || item.periodicidad === periodicidad); }), [clienteNames, deferredSearch, periodicidad, servicios, status]);
  const confirmDelete = () => { if (deleteId) eliminar.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); };

  return <Stack className="recurring-page" gap="lg"><Group justify="space-between" align="flex-end" gap="md" wrap="wrap"><div><Title order={1}>Servicios recurrentes</Title><Text c="dimmed" mt={6}>Controla las renovaciones y servicios periódicos de tus clientes.</Text></div><Button onClick={() => navigate("/recurrentes/nuevo")}>Nuevo servicio</Button></Group><ServiciosRecurrentesToolbar search={search} status={status} periodicidad={periodicidad} count={filtered.length} onSearchChange={setSearch} onStatusChange={setStatus} onPeriodicityChange={setPeriodicidad} onCreate={() => navigate("/recurrentes/nuevo")} />{isError ? <Alert color="red" title="No se han podido cargar los servicios recurrentes" icon={<IconAlertCircle size={18} />}><Button variant="light" color="red" mt="sm" leftSection={<IconRefresh size={15} />} onClick={() => refetch()}>Reintentar</Button></Alert> : servicios.length === 0 && !isLoading ? <Paper className="clients-empty-state" withBorder p="xl"><Stack align="center" gap="xs"><Text fw={650}>Sin servicios recurrentes</Text><Text size="sm" c="dimmed">Los servicios periódicos de tus clientes aparecerán aquí.</Text><Button mt="sm" onClick={() => navigate("/recurrentes/nuevo")}>Nuevo servicio</Button></Stack></Paper> : <ServiciosRecurrentesTable servicios={filtered} clientes={clienteNames} productos={productNames} loading={isLoading} onEdit={(item) => navigate(`/recurrentes/${item.id}/editar`)} onDelete={(item) => setDeleteId(item.id)} />}{deleteId && <Paper withBorder className="recurring-delete-confirm" p="md"><Group justify="space-between" wrap="wrap"><Text size="sm">¿Seguro que quieres eliminar este servicio recurrente?</Text><Group><Button variant="subtle" onClick={() => setDeleteId(null)}>Cancelar</Button><Button color="red" loading={eliminar.isPending} onClick={confirmDelete}>Eliminar</Button></Group></Group></Paper>}</Stack>;
}
