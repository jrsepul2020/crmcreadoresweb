import { useState } from "react";
import { Alert, Button, Group, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useClientes } from "../api/clientes";
import { useActualizarProyecto, useCrearProyecto, useProyecto, type Proyecto } from "../api/proyectos";
import ProyectoForm, { type ProyectoFormValues } from "../components/proyectos/ProyectoForm";

export default function ProyectoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const { data: proyecto, isLoading: projectLoading, isError: projectError } = useProyecto(id);
  const { data: clientes = [], isLoading: clientsLoading, isError: clientsError } = useClientes();
  const crear = useCrearProyecto();
  const actualizar = useActualizarProyecto();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (values: ProyectoFormValues) => {
    if (!values.clienteId) return;
    setErrorMessage("");
    const data: Partial<Proyecto> = {
      nombre: values.nombre.trim(),
      clienteId: values.clienteId,
      estado: values.estado,
      fechaInicio: values.fechaInicio || undefined,
      fechaPrevista: values.fechaPrevista || undefined,
      notas: values.notas.trim() || undefined,
    };
    const options = {
      onSuccess: (saved: Proyecto) => navigate(`/proyectos/${saved.id}`),
      onError: () => setErrorMessage(`No se ha podido ${editing ? "guardar" : "crear"} el proyecto. Inténtalo de nuevo.`),
    };
    if (editing && id) actualizar.mutate({ id, data }, options);
    else crear.mutate(data, options);
  };

  if (editing && projectLoading) return <Stack className="project-form-page" gap="lg"><Skeleton height={36} width="42%" /><Skeleton height={220} /></Stack>;
  if (editing && (projectError || !proyecto)) return <Stack className="project-form-page"><Alert color="red" icon={<IconAlertCircle size={18} />} title="No se ha podido cargar el proyecto" /><Button component={Link} to="/proyectos" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a proyectos</Button></Stack>;
  if (clientsError) return <Stack className="project-form-page"><Alert color="red" icon={<IconAlertCircle size={18} />} title="No se han podido cargar los clientes" /><Button component={Link} to="/proyectos" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a proyectos</Button></Stack>;

  return <Stack className="project-form-page" gap="lg">
    <Button component={Link} to={editing && id ? `/proyectos/${id}` : "/proyectos"} variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>{editing ? "Volver al proyecto" : "Volver a proyectos"}</Button>
    <div><Title order={1}>{editing ? "Editar proyecto" : "Nuevo proyecto"}</Title><Text c="dimmed" mt={6}>{editing ? "Actualiza la información del proyecto." : "Crea un proyecto para empezar a organizar el trabajo."}</Text></div>
    {!clientsLoading && <ProyectoForm proyecto={proyecto ?? null} clientes={clientes} loading={crear.isPending || actualizar.isPending} errorMessage={errorMessage} onSubmit={handleSubmit} onCancel={() => navigate(editing && id ? `/proyectos/${id}` : "/proyectos")} />}
  </Stack>;
}
