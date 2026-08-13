import { useState } from "react";
import { Table, Button, Modal, TextInput, Select, NumberInput, Group, ActionIcon, Title, Stack } from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { usePresupuestos, useCrearPresupuesto, useEliminarPresupuesto } from "../api/presupuestos";
import { useClientes } from "../api/clientes";

export default function PresupuestosPage() {
  const { data: presupuestos, isLoading } = usePresupuestos();
  const { data: clientes } = useClientes();
  const crear = useCrearPresupuesto();
  const eliminar = useEliminarPresupuesto();
  const [opened, setOpened] = useState(false);
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState("borrador");
  const [total, setTotal] = useState<number | string>("");
  const [clienteId, setClienteId] = useState<string | null>(null);

  const handleCrear = () => {
    if (!clienteId) return;
    crear.mutate({ numero, estado, total: Number(total), clienteId }, {
      onSuccess: () => {
        setOpened(false);
        setNumero("");
        setEstado("borrador");
        setTotal("");
        setClienteId(null);
      },
    });
  };

  const clienteOptions = clientes?.map((c) => ({ value: c.id, label: c.nombre })) ?? [];
  const nombreCliente = (id: string) => clientes?.find((c) => c.id === id)?.nombre ?? id;

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Presupuestos</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Nuevo presupuesto
        </Button>
      </Group>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Número</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Cliente</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {presupuestos?.map((p) => (
              <Table.Tr key={p.id}>
                <Table.Td>{p.numero}</Table.Td>
                <Table.Td>{p.estado}</Table.Td>
                <Table.Td>{p.total} €</Table.Td>
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

      <Modal opened={opened} onClose={() => setOpened(false)} title="Nuevo presupuesto">
        <Stack>
          <TextInput label="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
          <Select
            label="Estado"
            data={["borrador", "enviado", "aceptado", "rechazado"]}
            value={estado}
            onChange={(v) => setEstado(v ?? "borrador")}
          />
          <NumberInput
            label="Total"
            value={total}
            onChange={setTotal}
            decimalScale={2}
            min={0}
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