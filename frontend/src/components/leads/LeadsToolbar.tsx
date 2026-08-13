import { Button, Group, Menu, Text, TextInput } from "@mantine/core";
import { IconAdjustmentsHorizontal, IconSearch } from "@tabler/icons-react";
import type { LeadStatus } from "../../api/leads";
import { statusLabels } from "./LeadStatusBadge";

type LeadFilter = "todos" | LeadStatus;

interface LeadsToolbarProps {
  search: string;
  filter: LeadFilter;
  count: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: LeadFilter) => void;
}

export default function LeadsToolbar({ search, filter, count, onSearchChange, onFilterChange }: LeadsToolbarProps) {
  const filterLabel = filter === "todos" ? "Todos" : statusLabels[filter];

  return (
    <Group justify="space-between" align="center" gap="md" wrap="wrap" className="clients-toolbar">
      <Group gap="sm" wrap="wrap">
        <TextInput
          aria-label="Buscar leads"
          placeholder="Buscar leads..."
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
            <Menu.Label>Filtrar por estado</Menu.Label>
            <Menu.Item onClick={() => onFilterChange("todos")}>Todos</Menu.Item>
            {(Object.keys(statusLabels) as LeadStatus[]).map((status) => (
              <Menu.Item key={status} onClick={() => onFilterChange(status)}>{statusLabels[status]}</Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Group gap="md" ml="auto">
        <Text size="sm" c="dimmed">{count} {count === 1 ? "lead" : "leads"}</Text>
      </Group>
    </Group>
  );
}

export type { LeadFilter };
