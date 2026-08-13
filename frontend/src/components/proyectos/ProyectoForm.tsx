import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Alert, Button, Group, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Cliente } from "../../api/clientes";
import type { Proyecto } from "../../api/proyectos";
import { statusLabels } from "./ProyectoStatusBadge";

export interface ProyectoFormValues {
  nombre: string;
  clienteId: string | null;
  estado: Proyecto["estado"];
  fechaInicio: string;
  fechaPrevista: string;
  notas: string;
}

interface ProyectoFormProps {
  proyecto: Proyecto | null;
  clientes: Cliente[];
  loading: boolean;
  errorMessage?: string;
  onSubmit: (values: ProyectoFormValues) => void;
  onCancel: () => void;
}

const emptyValues: ProyectoFormValues = {
  nombre: "",
  clienteId: null,
  estado: "pendiente",
  fechaInicio: "",
  fechaPrevista: "",
  notas: "",
};

const statusOptions = (Object.keys(statusLabels) as Proyecto["estado"][]).map((value) => ({ value, label: statusLabels[value] }));

export default function ProyectoForm({ proyecto, clientes, loading, errorMessage, onSubmit, onCancel }: ProyectoFormProps) {
  const form = useForm<ProyectoFormValues>({
    initialValues: emptyValues,
    validate: {
      nombre: (value) => (value.trim() ? null : "El nombre es obligatorio"),
      clienteId: (value) => (value ? null : "Selecciona un cliente"),
      fechaPrevista: (value, values) => value && values.fechaInicio && value < values.fechaInicio ? "Debe ser posterior a la fecha de inicio" : null,
    },
  });

  useEffect(() => {
    form.setValues(proyecto ? {
      nombre: proyecto.nombre,
      clienteId: proyecto.clienteId,
      estado: proyecto.estado,
      fechaInicio: proyecto.fechaInicio ?? "",
      fechaPrevista: proyecto.fechaPrevista ?? "",
      notas: proyecto.notas ?? "",
    } : emptyValues);
    form.resetDirty();
  }, [proyecto]);

  const clienteOptions = clientes.map((cliente) => ({ value: cliente.id, label: cliente.empresa || cliente.nombre }));

  return <form onSubmit={form.onSubmit(onSubmit)}>
    <Stack gap="lg">
      {errorMessage && <Alert color="red" icon={<IconAlertCircle size={18} />}>{errorMessage}</Alert>}
      <Text size="xs" fw={700} tt="uppercase" c="dimmed">Datos del proyecto</Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <TextInput label="Nombre" withAsterisk placeholder="Nombre del proyecto" {...form.getInputProps("nombre")} />
        <Select label="Cliente" withAsterisk placeholder="Selecciona un cliente" data={clienteOptions} searchable {...form.getInputProps("clienteId")} />
        <Select label="Estado" data={statusOptions} className="project-status-field" {...form.getInputProps("estado")} />
        <TextInput label="Fecha de inicio" type="date" className="project-date-field" {...form.getInputProps("fechaInicio")} />
        <TextInput label="Fecha prevista" type="date" className="project-date-field" {...form.getInputProps("fechaPrevista")} />
      </SimpleGrid>
      <Textarea label="Notas" placeholder="Notas internas del proyecto" minRows={5} {...form.getInputProps("notas")} />
      <Group justify="flex-end" gap="sm">
        <Button variant="subtle" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" loading={loading}>{proyecto ? "Guardar cambios" : "Crear proyecto"}</Button>
      </Group>
    </Stack>
  </form>;
}
