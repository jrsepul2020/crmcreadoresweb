
import { AppShell, NavLink, Title, Button, Group, Burger, Text, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../api/supabase";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  IconUsers,
  IconTruck,
  IconBox,
  IconFolder,
  IconChecklist,
  IconFileInvoice,
  IconLogout,
  IconSettings,
  IconLayoutDashboard,
  IconUsersGroup,
  IconCash,
} from "@tabler/icons-react";

const navigationGroups = [
  {
    label: "Gestión",
    links: [
      { label: "Dashboard", path: "/", icon: IconLayoutDashboard },
      { label: "Leads", path: "/leads", icon: IconUsersGroup },
      { label: "Clientes", path: "/clientes", icon: IconUsers },
      { label: "Proyectos", path: "/proyectos", icon: IconFolder },
      { label: "Tareas", path: "/tareas", icon: IconChecklist },
    ],
  },
  {
    label: "Comercial",
    links: [
      { label: "Presupuestos", path: "/presupuestos", icon: IconFileInvoice },
      { label: "Productos", path: "/productos", icon: IconBox },
      { label: "Servicios recurrentes", path: "/recurrentes", icon: IconBox },
      { label: "Servicios", path: "/servicios", icon: IconBox },
      { label: "Cobros", path: "/cobros", icon: IconCash },
    ],
  },
  {
    label: "Recursos",
    links: [{ label: "Proveedores", path: "/proveedores", icon: IconTruck }],
  },
  {
    label: "Configuración",
    links: [{ label: "Configuración", path: "/configuracion", icon: IconSettings }],
  },
];

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/clientes": "Clientes",
  "/proyectos": "Proyectos",
  "/recurrentes": "Servicios recurrentes",
  "/clientes/:id": "Cliente",
  "/leads": "Leads",
  "/proveedores": "Proveedores",
  "/productos": "Productos",
  "/tareas": "Tareas",
  "/presupuestos": "Presupuestos",
  "/design-system": "Sistema visual",
};

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const pageTitle = pageTitles[location.pathname] ?? "Creadores Web";

  const goTo = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 248, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header className="app-header">
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Abrir navegación" />
            <Title order={3} className="brand-title">Creadores Web</Title>
          </Group>
          <Group visibleFrom="sm" gap="xs">
            <Text size="sm" fw={600}>{pageTitle}</Text>
            <Text size="sm" c="dimmed">/</Text>
            <Text size="sm" c="dimmed">Gestión operativa</Text>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className="app-navbar">
        {navigationGroups.map((group, index) => (
          <div key={group.label} className="nav-group">
            {index > 0 && <Divider my="sm" />}
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="xs" px="xs">{group.label}</Text>
            {group.links.map((link) => (
              <NavLink
                key={link.path}
                label={link.label}
                leftSection={<link.icon size={18} />}
                active={location.pathname === link.path}
                onClick={() => goTo(link.path)}
              />
            ))}
          </div>
        ))}
        <Button
          variant="subtle"
          color="red"
          fullWidth
          mt="auto"
          leftSection={<IconLogout size={18} />}
          onClick={() => supabase.auth.signOut()}
        >
          Cerrar sesión
        </Button>
      </AppShell.Navbar>
      <AppShell.Main className="app-main">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}