import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconInfoCircle,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";

const statuses = [
  ["activo", "green"],
  ["pendiente", "yellow"],
  ["completado", "green"],
  ["cancelado", "gray"],
  ["borrador", "gray"],
  ["enviado", "blue"],
  ["aceptado", "green"],
  ["rechazado", "red"],
  ["vencido", "orange"],
  ["bloqueado", "red"],
] as const;

const sampleRows = [
  { name: "Rediseño web corporativo", owner: "Cliente de ejemplo", status: "activo" },
  { name: "Mantenimiento mensual", owner: "Proyecto de ejemplo", status: "pendiente" },
  { name: "Propuesta de identidad", owner: "Lead de ejemplo", status: "aceptado" },
];

export default function DesignSystemPage() {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <Stack className="design-system-page" gap="xl">
      <header className="design-system-intro">
        <Text size="xs" fw={700} tt="uppercase" c="primary.7" lts="0.08em">
          Referencia interna
        </Text>
        <Title order={1}>Sistema visual del CRM</Title>
        <Text c="dimmed" maw={680}>
          Patrones compartidos para trabajar con clientes, proyectos y operaciones diarias con claridad.
        </Text>
      </header>

      <Paper className="ds-section" p="lg" withBorder>
        <Stack gap="md">
          <div>
            <Title order={3}>Jerarquía y acciones</Title>
            <Text size="sm" c="dimmed">Una acción principal por contexto. Las acciones destructivas quedan separadas.</Text>
          </div>
          <Group gap="sm" wrap="wrap">
            <Button leftSection={<IconPlus size={16} />}>Nuevo registro</Button>
            <Button variant="light">Guardar borrador</Button>
            <Button variant="subtle">Cancelar</Button>
            <Button color="red" variant="subtle" leftSection={<IconTrash size={16} />}>Eliminar</Button>
          </Group>
          <Divider />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput label="Nombre" placeholder="Nombre del registro" w={{ base: "100%", sm: 280 }} />
            <TextInput label="Email" placeholder="cliente@empresa.com" type="email" w={{ base: "100%", sm: 280 }} />
            <NumberInput label="Importe" placeholder="0,00" decimalScale={2} min={0} w={{ base: "100%", sm: 180 }} />
            <Select label="Estado" placeholder="Selecciona un estado" data={["Activo", "Pendiente", "Completado"]} w={{ base: "100%", sm: 220 }} />
          </SimpleGrid>
        </Stack>
      </Paper>

      <Paper className="ds-section" p="lg" withBorder>
        <Stack gap="md">
          <div>
            <Title order={3}>Estados</Title>
            <Text size="sm" c="dimmed">Los estados comunican intención con color semántico y texto.</Text>
          </div>
          <Group gap="xs" wrap="wrap">
            {statuses.map(([label, color]) => <Badge key={label} color={color} variant="light">{label}</Badge>)}
          </Group>
        </Stack>
      </Paper>

      <Paper className="ds-section" p="lg" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="flex-end" wrap="wrap">
            <div>
              <Title order={3}>Tabla operativa</Title>
              <Text size="sm" c="dimmed">Cabeceras contenidas, filas densas y acciones siempre reconocibles.</Text>
            </div>
            <TextInput aria-label="Buscar" placeholder="Buscar" leftSection={<IconSearch size={16} />} w={{ base: "100%", sm: 240 }} />
          </Group>
          <div className="ds-table-wrap">
            <Table withColumnBorders={false} verticalSpacing="sm">
              <Table.Thead><Table.Tr><Table.Th>Nombre</Table.Th><Table.Th>Responsable</Table.Th><Table.Th>Estado</Table.Th><Table.Th>Acciones</Table.Th></Table.Tr></Table.Thead>
              <Table.Tbody>{sampleRows.map((row) => <Table.Tr key={row.name}><Table.Td fw={600}>{row.name}</Table.Td><Table.Td c="dimmed">{row.owner}</Table.Td><Table.Td><Badge color={row.status === "aceptado" || row.status === "activo" ? "green" : "yellow"} variant="light">{row.status}</Badge></Table.Td><Table.Td><Button variant="subtle" size="compact-sm">Ver detalle</Button></Table.Td></Table.Tr>)}</Table.Tbody>
            </Table>
          </div>
        </Stack>
      </Paper>

      <Paper className="ds-section" p="lg" withBorder>
        <Stack gap="md">
          <div>
            <Title order={3}>Feedback y estados de interfaz</Title>
            <Text size="sm" c="dimmed">Los mensajes explican el estado y orientan la siguiente acción.</Text>
          </div>
          <Alert color="green" title="Guardado correctamente" icon={<IconCheck size={18} />}>El registro ya está disponible en la lista.</Alert>
          <Alert color="yellow" title="Revisión pendiente" icon={<IconAlertCircle size={18} />}>Hay información que conviene completar antes de enviarlo.</Alert>
          <Alert color="blue" title="Información" icon={<IconInfoCircle size={18} />}>Los cambios se sincronizan con Supabase.</Alert>
          <Group>
            <Button onClick={() => setModalOpened(true)}>Abrir modal</Button>
            <Button variant="light" loading>Procesando</Button>
          </Group>
        </Stack>
      </Paper>

      <Paper className="ds-empty-state" p="xl" withBorder>
        <Stack align="center" gap="xs">
          <Text fw={700}>No hay registros todavía</Text>
          <Text size="sm" c="dimmed" ta="center">Cuando crees el primero, aparecerá aquí para continuar trabajando.</Text>
          <Button variant="light" leftSection={<IconPlus size={16} />}>Crear primer registro</Button>
        </Stack>
      </Paper>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Confirmar acción">
        <Stack>
          <Text size="sm">Este modal mantiene el foco en una decisión concreta y ofrece una salida clara.</Text>
          <Group justify="flex-end"><Button variant="subtle" onClick={() => setModalOpened(false)}>Cancelar</Button><Button onClick={() => setModalOpened(false)}>Confirmar</Button></Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
