import { useState } from "react";
import { Alert, Button, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useProyectos } from "../api/proyectos";
import { useActualizarTarea, useCrearTarea, useTarea, type Tarea } from "../api/tareas";
import TareaForm, { type TareaFormValues } from "../components/tareas/TareaForm";

export default function TareaFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const proyectoInicial = searchParams.get("proyectoId");
  const { data: tarea, isLoading: taskLoading, isError: taskError } = useTarea(id);
  const { data: proyectos = [], isLoading: projectsLoading, isError: projectsError } = useProyectos();
  const crear = useCrearTarea();
  const actualizar = useActualizarTarea();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (values: TareaFormValues) => {
    if (!values.proyectoId) return;
    setErrorMessage("");
    const data: Partial<Tarea> = { titulo: values.titulo.trim(), proyectoId: values.proyectoId, estado: values.estado };
    const options = { onSuccess: (saved: Tarea) => navigate(`/tareas/${saved.id}`), onError: () => setErrorMessage(`No se ha podido ${editing ? "guardar" : "crear"} la tarea.`) };
    if (editing && id) actualizar.mutate({ id, data }, options);
    else crear.mutate(data, options);
  };

  if (editing && taskLoading) return <Stack className="task-form-page"><Skeleton height={36} width="42%" /><Skeleton height={180} /></Stack>;
  if (editing && (taskError || !tarea)) return <Stack className="task-form-page"><Alert color="red" title="No se ha podido cargar la tarea" icon={<IconAlertCircle size={18} />} /><Button component={Link} to="/tareas" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a tareas</Button></Stack>;
  if (projectsError) return <Stack className="task-form-page"><Alert color="red" title="No se han podido cargar los proyectos" icon={<IconAlertCircle size={18} />} /><Button component={Link} to="/tareas" variant="subtle" leftSection={<IconArrowLeft size={16} />}>Volver a tareas</Button></Stack>;

  return <Stack className="task-form-page" gap="lg"><Button component={Link} to={editing && id ? `/tareas/${id}` : "/tareas"} variant="subtle" size="compact-sm" leftSection={<IconArrowLeft size={16} />}>{editing ? "Volver a la tarea" : "Volver a tareas"}</Button><div><Title order={1}>{editing ? "Editar tarea" : "Nueva tarea"}</Title><Text c="dimmed" mt={6}>{editing ? "Actualiza la información de la tarea." : "Crea una tarea dentro de un proyecto existente."}</Text></div>{!projectsLoading && <TareaForm tarea={tarea ?? null} proyectos={proyectos} proyectoInicial={proyectoInicial} loading={crear.isPending || actualizar.isPending} errorMessage={errorMessage} onSubmit={handleSubmit} onCancel={() => navigate(editing && id ? `/tareas/${id}` : "/tareas")} />}</Stack>;
}
