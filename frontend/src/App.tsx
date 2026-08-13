import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader, Center } from "@mantine/core";
import Layout from "./components/Layout";
import ClientesPage from "./pages/ClientesPage";
import ProveedoresPage from "./pages/ProveedoresPage";
import ProductosPage from "./pages/ProductosPage";
import ProyectosPage from "./pages/ProyectosPage";
import TareasPage from "./pages/TareasPage";
import PresupuestosPage from "./pages/PresupuestosPage";
import LoginPage from "./pages/LoginPage";
import { supabase } from "./api/supabase";
import type { Session } from "@supabase/supabase-js";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (!session) {
    return <LoginPage onLogin={() => {}} />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/clientes" replace />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/proyectos" element={<ProyectosPage />} />
        <Route path="/tareas" element={<TareasPage />} />
        <Route path="/presupuestos" element={<PresupuestosPage />} />
      </Route>
    </Routes>
  );
}

export default App;