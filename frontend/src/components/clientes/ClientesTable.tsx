import { Button, Center, Group, Menu, Paper, Skeleton, Stack, Table, Text } from "@mantine/core";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Cliente } from "../../api/clientes";

interface ClientesTableProps {
  clientes: Cliente[];
  loading: boolean;
  onView: (cliente: Cliente) => void;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function ClientSkeletonRows() {
  return <>{Array.from({ length: 5 }, (_, index) => (
    <Table.Tr key={index}>
      <Table.Td><Skeleton height={16} width="70%" /><Skeleton height={12} width="42%" mt={6} /></Table.Td>
      <Table.Td><Skeleton height={16} width="85%" /></Table.Td>
      <Table.Td><Skeleton height={16} width={110} /></Table.Td>
      <Table.Td><Skeleton height={16} width={95} /></Table.Td>
      <Table.Td><Skeleton height={16} width={90} /></Table.Td>
      <Table.Td><Skeleton height={30} width={30} circle /></Table.Td>
    </Table.Tr>
  ))}</>;
}

function ClientSkeletonCards() {
  return <div className="clients-mobile-list">{Array.from({ length: 3 }, (_, index) => (
    <Paper key={index} className="client-mobile-card" withBorder p="md">
      <Skeleton height={18} width="58%" />
      <Skeleton height={14} width="82%" mt="md" />
      <Skeleton height={14} width="55%" mt={8} />
    </Paper>
  ))}</div>;
}

function ClientMobileCards({ clientes, loading, onView, onEdit, onDelete }: ClientesTableProps) {
  if (loading) return <ClientSkeletonCards />;
  if (clientes.length === 0) {
    return <Center className="clients-filter-empty" py="xl"><Text size="sm" c="dimmed">No hay clientes que coincidan con la búsqueda.</Text></Center>;
  }

  return <div className="clients-mobile-list">
    {clientes.map((cliente) => (
      <Paper key={cliente.id} className="client-mobile-card" withBorder p="md">
        <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
          <Stack gap={2} miw={0}>
            <Text component={Link} to={`/clientes/${cliente.id}`} fw={650} truncate className="client-name-link">{cliente.nombre}</Text>
            {cliente.nif && <Text size="xs" c="dimmed">{cliente.nif}</Text>}
          </Stack>
          <Menu shadow="sm" position="bottom-end" withinPortal>
            <Menu.Target>
              <Button variant="subtle" color="gray" size="compact-sm" aria-label={`Acciones de ${cliente.nombre}`} px={6}>
                <IconDots size={18} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={16} />} onClick={() => onView(cliente)}>Ver cliente</Menu.Item>
              <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => onEdit(cliente)}>Editar</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => onDelete(cliente)}>Eliminar</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Stack gap={4} mt="md" className="client-mobile-meta">
          <Text size="sm" truncate>{cliente.email || "—"}</Text>
          <Text size="sm">{cliente.telefono || "—"}{cliente.nif ? ` · ${cliente.nif}` : ""}</Text>
          <Text size="xs" c="dimmed">{formatDate(cliente.createdAt)}</Text>
        </Stack>
      </Paper>
    ))}
  </div>;
}

export default function ClientesTable({ clientes, loading, onView, onEdit, onDelete }: ClientesTableProps) {
  return (
    <>
      <div className="clients-table-shell">
        <Table withColumnBorders={false} verticalSpacing="sm" className="clients-table">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th className="client-email-column">Email</Table.Th>
            <Table.Th className="client-phone-column">Teléfono</Table.Th>
            <Table.Th className="client-date-column">Fecha alta</Table.Th>
            <Table.Th className="client-actions-column">Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? <ClientSkeletonRows /> : clientes.map((cliente) => (
            <Table.Tr key={cliente.id}>
              <Table.Td className="client-name-cell">
                <Text component={Link} to={`/clientes/${cliente.id}`} fw={650} truncate className="client-name-link">{cliente.nombre}</Text>
                {cliente.nif && <Text size="xs" c="dimmed" mt={3}>{cliente.nif}</Text>}
              </Table.Td>
              <Table.Td className="client-email-cell"><Text truncate>{cliente.email || "—"}</Text></Table.Td>
              <Table.Td className="client-phone-cell"><Text>{cliente.telefono || "—"}</Text></Table.Td>
              <Table.Td className="client-date-cell"><Text size="sm" c="dimmed">{formatDate(cliente.createdAt)}</Text></Table.Td>
              <Table.Td className="client-actions-cell">
                <Menu shadow="sm" position="bottom-end" withinPortal>
                  <Menu.Target>
                    <Button variant="subtle" color="gray" size="compact-sm" aria-label={`Acciones de ${cliente.nombre}`} px={6}>
                      <IconDots size={18} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEye size={16} />} onClick={() => onView(cliente)}>Ver cliente</Menu.Item>
                    <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => onEdit(cliente)}>Editar</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => onDelete(cliente)}>Eliminar</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
        </Table>
        {!loading && clientes.length === 0 && (
          <Center className="clients-filter-empty" py="xl">
            <Text size="sm" c="dimmed">No hay clientes que coincidan con la búsqueda.</Text>
          </Center>
        )}
      </div>
      <ClientMobileCards clientes={clientes} loading={loading} onView={onView} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
}
