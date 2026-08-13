import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Alert, Button, Group, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Proyecto } from "../../api/proyectos";
import type { Tarea } from "../../api/tareas";
import { statusLabels } from "./TareaStatusBadge";

export interface TareaFormValues {
  titulo: string;
  proyectoId: string | null;
  estado: Tarea["estado"];
}

interface TareaFormProps {
  tarea: Tarea | null;
  proyectos: Proyecto[];
  proyectoInicial?: string | null;
  loading: boolean;
  errorMessage?: string;
  onSubmit: (values: TareaFormValues) => void;
  onCancel: () => void;
}

const emptyValues: TareaFormValues = { titulo: "", proyectoId: null, estado: "pendiente" };
const statuses = (Object.keys(statusLabels) as Tarea["estado"][]).map((value) => ({ value, label: statusLabels[value] }));

export default function TareaForm({ tarea, proyectos, proyectoInicial, loading, errorMessage, onSubmit, onCancel }: TareaFormProps) {
  const form = useForm<TareaFormValues>({
    initialValues: emptyValues,
    validate: {
      titulo: (value) => value.trim() ? null : "El título es obligatorio",
      proyectoId: (value) => value ? null : "Selecciona un proyecto",
    },
  });

  useEffect(() => {
    form.setValues(tarea ? { titulo: tarea.titulo, proyectoId: tarea.proyectoId, estado: tarea.estado } : { ...emptyValues, proyectoId: proyectoInicial ?? null });
    form.resetDirty();
  }, [proyectoInicial, tarea]);

  return <form onSubmit={form.onSubmit(onSubmit)}><Stack gap="lg">
    {errorMessage && <Alert color="red" icon={<IconAlertCircle size={18} />}>{errorMessage}</Alert>}
    <Text size="xs" fw={700} tt="uppercase" c="dimmed">Datos de la tarea</Text>
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      <TextInput label="Título" withAsterisk placeholder="Título de la tarea" {...form.getInputProps("titulo")} />
      <Select label="Proyecto" withAsterisk placeholder="Selecciona un proyecto" data={proyectos.map((project) => ({ value: project.id, label: project.nombre }))} searchable disabled={Boolean(proyectoInicial && !tarea)} {...form.getInputProps("proyectoId")} />
      <Select label="Estado" data={statuses} className="task-status-field" {...form.getInputProps("estado")} />
    </SimpleGrid>
    <Group justify="flex-end" gap="sm"><Button variant="subtle" type="button" onClick={onCancel}>Cancelar</Button><Button type="submit" loading={loading}>{tarea ? "Guardar cambios" : "Crear tarea"}</Button></Group>
  </Stack></form>;
}
