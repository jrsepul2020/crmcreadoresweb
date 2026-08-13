import { useDeferredValue, useMemo, useState } from "react";
import { Alert, Button, Group, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconPlus, IconUsers } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
  useActualizarCliente,
  useClientes,
  useCrearCliente,
  useEliminarCliente,
  type Cliente,
} from "../api/clientes";
import ClientesTable from "../components/clientes/ClientesTable";
import ClientesToolbar, { type ClienteFilter } from "../components/clientes/ClientesToolbar";
import ClienteForm, { type ClienteFormValues } from "../components/clientes/ClienteForm";

export default function ClientesPage() {
  const { data: clientes = [], isLoading, isError, refetch } = useClientes();
  const navigate = useNavigate();
  const crear = useCrearCliente();
  const actualizar = useActualizarCliente();
  const eliminar = useEliminarCliente();
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ClienteFilter>("todos");
  const [mutationError, setMutationError] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const filteredClientes = useMemo(() => clientes.filter((cliente) => {
    const matchesSearch = [cliente.nombre, cliente.email, cliente.telefono, cliente.nif]
      .some((value) => value?.toLowerCase().includes(deferredSearch));
    const matchesFilter = filter === "todos" || (filter === "con-email" ? Boolean(cliente.email) : !cliente.email);
    return matchesSearch && matchesFilter;
  }), [clientes, deferredSearch, filter]);

  const openCreate = () => {
    setSelectedCliente(null);
    setMutationError("");
    setFormOpened(true);
  };

  const openEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setMutationError("");
    setFormOpened(true);
  };

  const handleSubmit = (values: ClienteFormValues) => {
    setMutationError("");
    const data = {
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
    };
    const options = {
      onSuccess: () => setFormOpened(false),
      onError: () => setMutationError("No se ha podido guardar el cliente. Inténtalo de nuevo."),
    };
    if (selectedCliente) {
      actualizar.mutate({ id: selectedCliente.id, data }, options);
    } else {
      crear.mutate(data, options);
    }
  };

  const confirmDelete = () => {
    if (!selectedCliente) return;
    eliminar.mutate(selectedCliente.id, {
      onSuccess: () => {
        setDeleteOpened(false);
        setSelectedCliente(null);
      },
    });
  };

  return (
    <Stack className="clients-page" gap="lg">
      <Group justify="space-between" align="flex-end" gap="md" wrap="wrap">
        <div>
          <Title order={1}>Clientes</Title>
          <Text c="dimmed" mt={6}>Gestiona tus clientes y su información comercial.</Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>Nuevo cliente</Button>
      </Group>

      <ClientesToolbar
        search={search}
        filter={filter}
        count={filteredClientes.length}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />

      {isError ? (
        <Alert color="red" title="No se han podido cargar los clientes" icon={<IconAlertCircle size={18} />}>
          <Group justify="space-between" mt="sm" gap="sm" wrap="wrap">
            <Text size="sm">Comprueba la conexión e inténtalo de nuevo.</Text>
            <Button variant="light" color="red" size="compact-sm" onClick={() => refetch()}>Reintentar</Button>
          </Group>
        </Alert>
      ) : clientes.length === 0 && !isLoading ? (
        <Paper className="clients-empty-state" withBorder p="xl">
          <Stack align="center" gap="xs">
            <IconUsers size={30} stroke={1.5} color="var(--app-accent)" />
            <Text fw={650} mt="xs">Todavía no tienes clientes registrados</Text>
            <Text size="sm" c="dimmed" ta="center">Crea tu primer cliente para empezar a organizar la actividad comercial.</Text>
          </Stack>
        </Paper>
      ) : (
        <ClientesTable
          clientes={filteredClientes}
          loading={isLoading}
          onView={(cliente) => navigate(`/clientes/${cliente.id}`)}
          onEdit={openEdit}
          onDelete={(cliente) => { setSelectedCliente(cliente); setDeleteOpened(true); }}
        />
      )}

      <Modal opened={formOpened} onClose={() => setFormOpened(false)} title={selectedCliente ? "Editar cliente" : "Nuevo cliente"} size="md">
        <ClienteForm
          cliente={selectedCliente}
          loading={crear.isPending || actualizar.isPending}
          errorMessage={mutationError}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpened(false)}
        />
      </Modal>

      <Modal opened={deleteOpened} onClose={() => setDeleteOpened(false)} title="Eliminar cliente" size="sm">
        <Stack>
          <Text size="sm">¿Seguro que quieres eliminar a <strong>{selectedCliente?.nombre}</strong>? Esta acción no se puede deshacer.</Text>
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={() => setDeleteOpened(false)}>Cancelar</Button>
            <Button color="red" loading={eliminar.isPending} onClick={confirmDelete}>Eliminar</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}