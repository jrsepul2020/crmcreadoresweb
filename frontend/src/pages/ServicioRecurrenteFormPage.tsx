import { useState } from "react";
import { Alert, Button, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useProductos } from "../api/productos";
import { useActualizarServicioRecurrente, useCrearServicioRecurrente, useServicioRecurrente, type ServicioRecurrente } from "../api/serviciosRecurrentes";
import ServicioRecurrenteForm, { type ServicioRecurrenteFormValues } from "../components/recurrentes/ServicioRecurrenteForm";

export default function ServicioRecurrenteFormPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const { data: servicio, isLoading, isError } = useServicioRecurrente(id);
  const { data: clientes = [], isError: clientsError } = useClientes();
  const { data: productos = [], isError: productsError } = useProductos();
  const crear = useCrearServicioRecurrente();
  const actualizar = useActualizarServicioRecurrente();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (values: ServicioRecurrenteFormValues) => {
    if (!values.clienteId) return;
    const data: Partial<ServicioRecurrente> = { clienteId: values.clienteId, productoId: values.productoId || undefined, descripcion: values.descripcion.trim(), precio: Number(values.precio), periodicidad: values.periodicidad, fechaInicio: values.fechaInicio, proximaRenovacion: values.proximaRenovacion, estado: values.estado, notas: values.notas.trim() || undefined };
    const options = { onSuccess: (saved: ServicioRecurrente) => navigate(`/recurrentes/${saved.id}`), onError: () => setErrorMessage("No se ha podido guardar el servicio recurrente.") };
    if (editing && id) actualizar.mutate({ id, data }, options); else crear.mutate(data, options);
  };

  if (editing && isLoading) return <Stack className="recurring-form-page"><Skeleton height={36} width="45%" /><Skeleton height={220} /></Stack>;
  if (editing && (isError || !servicio)) return <Stack className="recurring-form-page"><Alert color="red" title="No se ha podido cargar el servicio" icon={<IconAlertCircle size={18} />} /><Button component={Link} to="/recurrentes" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a servicios</Button></Stack>;
  if (clientsError || productsError) return <Stack className="recurring-form-page"><Alert color="red" title="No se han podido cargar los datos necesarios" icon={<IconAlertCircle size={18} />} /><Button component={Link} to="/recurrentes" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a servicios</Button></Stack>;

  return <Stack className="recurring-form-page" gap="lg"><Button component={Link} to={editing && id ? `/recurrentes/${id}` : "/recurrentes"} variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>{editing ? "Volver al servicio" : "Volver a servicios"}</Button><div><Title order={1}>{editing ? "Editar servicio recurrente" : "Nuevo servicio recurrente"}</Title><Text c="dimmed" mt={6}>{editing ? "Actualiza el servicio contratado." : "Registra un servicio periódico de un cliente."}</Text></div><ServicioRecurrenteForm servicio={servicio ?? null} clientes={clientes} productos={productos} clienteInicial={params.get("clienteId")} loading={crear.isPending || actualizar.isPending} errorMessage={errorMessage} onSubmit={handleSubmit} onCancel={() => navigate(editing && id ? `/recurrentes/${id}` : "/recurrentes")} /></Stack>;
}
