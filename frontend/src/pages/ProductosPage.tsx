import { useState } from "react";
import { Table, Button, Modal, TextInput, Group, ActionIcon, Title, Stack } from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useProductos, useCrearProducto, useEliminarProducto } from "../api/productos";

export default function ProductosPage() {
  const { data: productos, isLoading } = useProductos();
  const crear = useCrearProducto();
  const eliminar = useEliminarProducto();
  const [opened, setOpened] = useState(false);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipo, setTipo] = useState("");

  const handleCrear = () => {
    crear.mutate({ nombre, precio: Number(precio), tipo }, {
      onSuccess: () => {
        setOpened(false);
        setNombre("");
        setPrecio("");
        setTipo("");
      },
    });
  };

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Productos</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Nuevo producto
        </Button>
      </Group>

      {isLoading ? <p>Cargando...</p> : (
        <Table striped highlightOnHover>
          <Table.Thead><Table.Tr><Table.Th>Nombre</Table.Th><Table.Th>Precio</Table.Th><Table.Th>Tipo</Table.Th><Table.Th></Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>
            {productos?.map((p) => <Table.Tr key={p.id}>
              <Table.Td>{p.nombre}</Table.Td><Table.Td>{p.precio}</Table.Td><Table.Td>{p.tipo}</Table.Td>
              <Table.Td><ActionIcon color="red" onClick={() => eliminar.mutate(p.id)}><IconTrash size={16} /></ActionIcon></Table.Td>
            </Table.Tr>)}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={() => setOpened(false)} title="Nuevo producto">
        <Stack>
          <TextInput label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <TextInput label="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
          <TextInput label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
          <Button onClick={handleCrear} loading={crear.isPending}>Guardar</Button>
        </Stack>
      </Modal>
    </Stack>
  );
}