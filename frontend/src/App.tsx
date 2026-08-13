import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Loader, Center } from "@mantine/core";
import Layout from "./components/Layout";
import ClientesPage from "./pages/ClientesPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import ProductosPage from "./pages/ProductosPage";
import ProyectosPage from "./pages/ProyectosPage";
import TareasPage from "./pages/TareasPage";
import PresupuestosPage from "./pages/PresupuestosPage";
import LoginPage from "./pages/LoginPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import ClienteDetailPage from "./pages/ClienteDetailPage";
import ProyectoFormPage from "./pages/ProyectoFormPage";
import ProyectoDetailPage from "./pages/ProyectoDetailPage";
import TareaFormPage from "./pages/TareaFormPage";
import TareaDetailPage from "./pages/TareaDetailPage";
import ServiciosRecurrentesPage from "./pages/ServiciosRecurrentesPage";
import ServicioRecurrenteFormPage from "./pages/ServicioRecurrenteFormPage";
import ServicioRecurrenteDetailPage from "./pages/ServicioRecurrenteDetailPage";
import { supabase } from "./api/supabase";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );
  }

  if (location.pathname === "/design-system") {
    return (
      <Routes>
        <Route element={<Layout />}>
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Route>
      </Routes>
    );
  }

  if (!session) {
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/:id" element={<ClienteDetailPage />} />
        <Route path="/clientes/:id/proyectos" element={<ClienteDetailPage />} />
        <Route path="/clientes/:id/presupuestos" element={<ClienteDetailPage />} />
        <Route path="/clientes/:id/facturas" element={<ClienteDetailPage />} />
        <Route path="/clientes/:id/tareas" element={<ClienteDetailPage />} />
        <Route path="/clientes/:id/cobros" element={<ClienteDetailPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/proyectos" element={<ProyectosPage />} />
        <Route path="/proyectos/nuevo" element={<ProyectoFormPage />} />
        <Route path="/proyectos/:id/editar" element={<ProyectoFormPage />} />
        <Route path="/proyectos/:id" element={<ProyectoDetailPage />} />
        <Route path="/tareas" element={<TareasPage />} />
        <Route path="/tareas/nuevo" element={<TareaFormPage />} />
        <Route path="/tareas/:id/editar" element={<TareaFormPage />} />
        <Route path="/tareas/:id" element={<TareaDetailPage />} />
        <Route path="/recurrentes" element={<ServiciosRecurrentesPage />} />
        <Route path="/recurrentes/nuevo" element={<ServicioRecurrenteFormPage />} />
        <Route path="/recurrentes/:id/editar" element={<ServicioRecurrenteFormPage />} />
        <Route path="/recurrentes/:id" element={<ServicioRecurrenteDetailPage />} />
        <Route path="/presupuestos" element={<PresupuestosPage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Route>
    </Routes>
  );
}

export default App;