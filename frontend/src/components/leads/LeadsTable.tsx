import { Button, Center, Group, Menu, Paper, Skeleton, Stack, Table, Text } from "@mantine/core";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import type { Lead } from "../../api/leads";
import LeadStatusBadge from "./LeadStatusBadge";

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function LeadActions({ lead, onEdit, onDelete }: { lead: Lead; onEdit: (lead: Lead) => void; onDelete: (lead: Lead) => void }) {
  return (
    <Menu shadow="sm" position="bottom-end" withinPortal>
      <Menu.Target>
        <Button variant="subtle" color="gray" size="compact-sm" aria-label={`Acciones de ${lead.nombre}`} px={6} onClick={(event) => event.stopPropagation()}>
          <IconDots size={18} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} to={`/leads/${lead.id}`} leftSection={<IconEye size={16} />}>Ver lead</Menu.Item>
        <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => onEdit(lead)}>Editar</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconTrash size={16} />} onClick={() => onDelete(lead)}>
          {lead.estado === "convertido" || lead.clienteId ? "Eliminar bloqueado" : "Eliminar"}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function LeadSkeletonRows() {
  return <>{Array.from({ length: 5 }, (_, index) => <Table.Tr key={index}>
    <Table.Td><Skeleton height={16} width="70%" /></Table.Td>
    <Table.Td><Skeleton height={16} width="70%" /></Table.Td>
    <Table.Td><Skeleton height={16} width="85%" /></Table.Td>
    <Table.Td><Skeleton height={16} width={105} /></Table.Td>
    <Table.Td><Skeleton height={24} width={96} /></Table.Td>
    <Table.Td><Skeleton height={16} width={100} /></Table.Td>
    <Table.Td><Skeleton height={30} width={30} circle /></Table.Td>
  </Table.Tr>)}</>;
}

function MobileLeadCards({ leads, loading, onEdit, onDelete }: LeadsTableProps) {
  if (loading) return <div className="clients-mobile-list">{Array.from({ length: 3 }, (_, index) => <Paper key={index} className="client-mobile-card" withBorder p="md"><Skeleton height={18} width="62%" /><Skeleton height={14} width="82%" mt="md" /><Skeleton height={14} width="50%" mt={8} /></Paper>)}</div>;
  if (!leads.length) return <Center py="xl"><Text size="sm" c="dimmed">No hay leads que coincidan con la búsqueda.</Text></Center>;

  return <div className="clients-mobile-list">
    {leads.map((lead) => <Paper key={lead.id} className="client-mobile-card lead-mobile-card" withBorder p="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <Stack gap={3} miw={0}>
          <Text component={Link} to={`/leads/${lead.id}`} fw={650} truncate className="lead-name-link">{lead.nombre}</Text>
          <Text size="xs" c="dimmed" truncate>{lead.empresa || "—"}</Text>
        </Stack>
        <Group gap="xs" wrap="nowrap"><LeadStatusBadge status={lead.estado} /><LeadActions lead={lead} onEdit={onEdit} onDelete={onDelete} /></Group>
      </Group>
      <Stack gap={4} mt="md">
        <Text size="sm" truncate>{lead.email || "—"}</Text>
        <Text size="sm">{lead.telefono || "—"}</Text>
        <Text size="xs" c="dimmed">{formatDate(lead.createdAt)}</Text>
      </Stack>
    </Paper>)}
  </div>;
}

export default function LeadsTable({ leads, loading, onEdit, onDelete }: LeadsTableProps) {
  const navigate = useNavigate();

  return <>
    <div className="leads-table-shell">
      <Table className="leads-table" verticalSpacing="sm">
        <Table.Thead><Table.Tr>
          <Table.Th>Nombre</Table.Th><Table.Th>Empresa</Table.Th><Table.Th className="lead-email-column">Email</Table.Th><Table.Th className="lead-phone-column">Teléfono</Table.Th><Table.Th>Estado</Table.Th><Table.Th className="lead-date-column">Fecha creación</Table.Th><Table.Th className="lead-actions-column">Acciones</Table.Th>
        </Table.Tr></Table.Thead>
        <Table.Tbody>{loading ? <LeadSkeletonRows /> : leads.map((lead) => <Table.Tr key={lead.id} className="lead-row" onClick={() => navigate(`/leads/${lead.id}`)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate(`/leads/${lead.id}`); }} tabIndex={0}>
          <Table.Td><Text component={Link} to={`/leads/${lead.id}`} fw={650} className="lead-name-link" onClick={(event) => event.stopPropagation()}>{lead.nombre}</Text></Table.Td>
          <Table.Td><Text truncate>{lead.empresa || "—"}</Text></Table.Td>
          <Table.Td className="lead-email-cell"><Text truncate>{lead.email || "—"}</Text></Table.Td>
          <Table.Td className="lead-phone-cell"><Text>{lead.telefono || "—"}</Text></Table.Td>
          <Table.Td><LeadStatusBadge status={lead.estado} /></Table.Td>
          <Table.Td className="lead-date-cell"><Text size="sm" c="dimmed">{formatDate(lead.createdAt)}</Text></Table.Td>
          <Table.Td className="lead-actions-cell"><LeadActions lead={lead} onEdit={onEdit} onDelete={onDelete} /></Table.Td>
        </Table.Tr>)}</Table.Tbody>
      </Table>
      {!loading && !leads.length && <Center py="xl"><Text size="sm" c="dimmed">No hay leads que coincidan con la búsqueda.</Text></Center>}
    </div>
    <MobileLeadCards leads={leads} loading={loading} onEdit={onEdit} onDelete={onDelete} />
  </>;
}
