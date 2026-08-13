import { useDeferredValue, useMemo, useState } from "react";
import { Alert, Button, Group, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconPlus, IconUsersGroup } from "@tabler/icons-react";
import { leadStatuses, useActualizarLead, useCrearLead, useEliminarLead, useLeads, type Lead, type LeadStatus } from "../api/leads";
import LeadForm, { type LeadFormValues } from "../components/leads/LeadForm";
import LeadsTable from "../components/leads/LeadsTable";
import LeadsToolbar, { type LeadFilter } from "../components/leads/LeadsToolbar";

export default function LeadsPage() {
  const { data: leads = [], isLoading, isError, refetch } = useLeads();
  const crear = useCrearLead();
  const actualizar = useActualizarLead();
  const eliminar = useEliminarLead();
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LeadFilter>("todos");
  const [errorMessage, setErrorMessage] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredLeads = useMemo(() => leads.filter((lead) => {
    const matchesSearch = [lead.nombre, lead.empresa, lead.email, lead.telefono]
      .some((value) => value?.toLowerCase().includes(deferredSearch));
    return matchesSearch && (filter === "todos" || lead.estado === filter);
  }), [deferredSearch, filter, leads]);

  const openCreate = () => {
    setSelectedLead(null);
    setErrorMessage("");
    setFormOpened(true);
  };

  const openEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setErrorMessage("");
    setFormOpened(true);
  };

  const handleSubmit = (values: LeadFormValues) => {
    setErrorMessage("");
    const data = {
      nombre: values.nombre.trim(),
      empresa: values.empresa.trim() || undefined,
      email: values.email.trim() || undefined,
      telefono: values.telefono.trim() || undefined,
      estado: values.estado as LeadStatus,
      notas: values.notas.trim() || undefined,
    };
    const options = {
      onSuccess: () => setFormOpened(false),
      onError: () => setErrorMessage("No se ha podido guardar el lead. Inténtalo de nuevo."),
    };
    if (selectedLead) actualizar.mutate({ id: selectedLead.id, data }, options);
    else crear.mutate(data, options);
  };

  const handleDelete = () => {
    if (!selectedLead) return;
    eliminar.mutate(selectedLead, {
      onSuccess: () => {
        setDeleteOpened(false);
        setSelectedLead(null);
      },
      onError: (error) => setErrorMessage(error.message || "No se ha podido eliminar el lead."),
    });
  };

  return <Stack className="clients-page" gap="lg">
    <Group justify="space-between" align="flex-end" gap="md" wrap="wrap">
      <div><Title order={1}>Leads</Title><Text c="dimmed" mt={6}>Gestiona oportunidades y conviértelas en clientes.</Text></div>
      <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>Nuevo lead</Button>
    </Group>
    <LeadsToolbar search={search} filter={filter} count={filteredLeads.length} onSearchChange={setSearch} onFilterChange={setFilter} />
    {errorMessage && !formOpened && <Alert color="red" icon={<IconAlertCircle size={18} />}>{errorMessage}</Alert>}
    {isError ? <Alert color="red" title="No se han podido cargar los leads" icon={<IconAlertCircle size={18} />}><Group justify="space-between" mt="sm"><Text size="sm">Comprueba la conexión e inténtalo de nuevo.</Text><Button variant="light" color="red" size="compact-sm" onClick={() => refetch()}>Reintentar</Button></Group></Alert>
      : leads.length === 0 && !isLoading ? <Paper className="clients-empty-state" withBorder p="xl"><Stack align="center" gap="xs"><IconUsersGroup size={30} stroke={1.5} color="var(--app-accent)" /><Text fw={650} mt="xs">Todavía no tienes leads registrados</Text><Text size="sm" c="dimmed" ta="center">Crea tu primera oportunidad para empezar a trabajarla.</Text></Stack></Paper>
      : <LeadsTable leads={filteredLeads} loading={isLoading} onEdit={openEdit} onDelete={(lead) => { setSelectedLead(lead); setErrorMessage(""); setDeleteOpened(true); }} />}

    <Modal opened={formOpened} onClose={() => setFormOpened(false)} title={selectedLead ? "Editar lead" : "Nuevo lead"} size="lg">
      <LeadForm lead={selectedLead} loading={crear.isPending || actualizar.isPending} errorMessage={errorMessage} onSubmit={handleSubmit} onCancel={() => setFormOpened(false)} />
    </Modal>
    <Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title="Eliminar lead" size="sm">
      <Stack><Text size="sm">{selectedLead?.clienteId || selectedLead?.estado === "convertido" ? "Este lead está convertido y no se puede eliminar porque está relacionado con un cliente." : <>¿Seguro que quieres eliminar a <strong>{selectedLead?.nombre}</strong>? Esta acción no se puede deshacer.</>}</Text><Group justify="flex-end"><Button variant="subtle" onClick={() => setDeleteOpened(false)}>Cancelar</Button>{!selectedLead?.clienteId && selectedLead?.estado !== "convertido" && <Button color="red" loading={eliminar.isPending} onClick={handleDelete}>Eliminar</Button>}</Group></Stack>
    </Modal>
  </Stack>;
}

export { leadStatuses };
