import { Button, Group, Menu, Text, TextInput } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";

type ClienteFilter = "todos" | "con-email" | "sin-email";

interface ClientesToolbarProps {
  search: string;
  filter: ClienteFilter;
  count: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: ClienteFilter) => void;
}

export default function ClientesToolbar({
  search,
  filter,
  count,
  onSearchChange,
  onFilterChange,
}: ClientesToolbarProps) {
  const filterLabel = filter === "con-email" ? "Con email" : filter === "sin-email" ? "Sin email" : "Todos";

  return (
    <Group justify="space-between" align="center" gap="md" wrap="wrap" className="clients-toolbar">
      <Group gap="sm" wrap="wrap">
        <TextInput
          aria-label="Buscar clientes"
          placeholder="Buscar clientes..."
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          className="clients-search"
        />
        <Menu shadow="sm" position="bottom-start" withinPortal>
          <Menu.Target>
            <Button variant="light" leftSection={<IconAdjustmentsHorizontal size={16} />}>
              Filtros{filter !== "todos" ? `: ${filterLabel}` : ""}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Mostrar clientes</Menu.Label>
            <Menu.Item onClick={() => onFilterChange("todos")} rightSection={filter === "todos" ? "✓" : undefined}>
              Todos
            </Menu.Item>
            <Menu.Item onClick={() => onFilterChange("con-email")} rightSection={filter === "con-email" ? "✓" : undefined}>
              Con email
            </Menu.Item>
            <Menu.Item onClick={() => onFilterChange("sin-email")} rightSection={filter === "sin-email" ? "✓" : undefined}>
              Sin email
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group gap="md" ml="auto">
        <Text size="sm" c="dimmed" className="clients-count">{count} {count === 1 ? "cliente" : "clientes"}</Text>
      </Group>
    </Group>
  );
}

export type { ClienteFilter };
