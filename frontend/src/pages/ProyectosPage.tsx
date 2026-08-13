import { useState } from "react";
import { Table, Button, Modal, TextInput, Select, Group, ActionIcon, Title, Stack } from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useProyectos, useCrearProyecto, useEliminarProyecto } from "../api/proyectos";
import { useClientes } from "../api/clientes";

export default function ProyectosPage() {
  const { data: proyectos, isLoading } = useProyectos();
  const { data: clientes } = useClientes();
  const crear = useCrearProyecto();
  const eliminar = useEliminarProyecto();
  const [opened, setOpened] = useState(false);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("activo");
  const [clienteId, setClienteId] = useState<string | null>(null);

  const handleCrear = () => {
    if (!clienteId) return;
    crear.mutate({ nombre, estado, clienteId }, {
      onSuccess: () => {
        setOpened(false);
        setNombre("");
        setEstado("activo");
        setClienteId(null);
      },
    });
  };

  const clienteOptions = clientes?.map((c) => ({ value: c.id, label: c.nombre })) ?? [];
  const nombreCliente = (id: string) => clientes?.find((c) => c.id === id)?.nombre ?? id;

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Proyectos</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Nuevo proyecto
        </Button>
      </Group>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {proyectos?.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.nombre}</Table.Td>
                <Table.Td>{p.estado}</Table.Td>
                <Table.Td>{nombreCliente(p.clienteId)}</Table.Td>
                <Table.Td>
                  <ActionIcon color="red" onClick={() => eliminar.mutate(p.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={() => setOpened(false)} title="Nuevo proyecto">
        <Stack>
          <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <Select
            label="Estado"
            data={["activo", "pausado", "finalizado"]}
            value={estado}
            onChange={(v) => setEstado(v ?? "activo")}
          />
          <Select
            label="Cliente"
            placeholder="Selecciona un cliente"
            data={clienteOptions}
            value={clienteId}
            onChange={setClienteId}
            searchable
          />
          <Button onClick={handleCrear} loading={crear.isPending} disabled={!clienteId}>
            Guardar
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}