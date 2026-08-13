
import { AppShell, NavLink, Title, Button } from "@mantine/core";
import { supabase } from "../api/supabase";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  IconUsers,
  IconTruck,
  IconBox,
  IconFolder,
  IconChecklist,
  IconFileInvoice,
} from "@tabler/icons-react";

const links = [
  { label: "Clientes", path: "/clientes", icon: IconUsers },
  { label: "Proveedores", path: "/proveedores", icon: IconTruck },
  { label: "Productos", path: "/productos", icon: IconBox },
  { label: "Proyectos", path: "/proyectos", icon: IconFolder },
  { label: "Tareas", path: "/tareas", icon: IconChecklist },
  { label: "Presupuestos", path: "/presupuestos", icon: IconFileInvoice },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppShell navbar={{ width: 220, breakpoint: "sm" }} padding="md">
      <AppShell.Navbar p="md">
        <Title order={3} mb="md">CRM Agencia</Title>
            <Button variant="light" color="red" fullWidth mb="md" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
            </Button>



        {links.map((link) => (
          <NavLink
            key={link.path}
            label={link.label}
            leftSection={<link.icon size={18} />}
            active={location.pathname === link.path}
            onClick={() => navigate(link.path)}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}