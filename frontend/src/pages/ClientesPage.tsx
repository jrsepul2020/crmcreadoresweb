import { useState } from "react";
import { Table, Button, Modal, TextInput, Group, ActionIcon, Title, Stack } from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useClientes, useCrearCliente, useEliminarCliente } from "../api/clientes";

export default function ClientesPage() {
  const { data: clientes, isLoading } = useClientes();
  const crear = useCrearCliente();
  const eliminar = useEliminarCliente();
  const [opened, setOpened] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const handleCrear = () => {
    crear.mutate({ nombre, email }, {
      onSuccess: () => {
        setOpened(false);
        setNombre("");
        setEmail("");
      },
    });
  };

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Clientes</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Nuevo cliente
        </Button>
      </Group>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {clientes?.map((c) => (
              <Table.Tr key={c.id}>
                <Table.Td>{c.nombre}</Table.Td>
                <Table.Td>{c.email}</Table.Td>
                <Table.Td>
                  <ActionIcon color="red" onClick={() => eliminar.mutate(c.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={() => setOpened(false)} title="Nuevo cliente">
        <Stack>
          <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextInput label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button onClick={handleCrear} loading={crear.isPending}>
            Guardar
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}