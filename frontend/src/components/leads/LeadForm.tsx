import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Alert, Button, Group, Select, SimpleGrid, Stack, Textarea, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Lead, LeadStatus } from "../../api/leads";
import { leadStatuses } from "../../api/leads";
import { statusLabels } from "./LeadStatusBadge";

export interface LeadFormValues {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  estado: LeadStatus;
  notas: string;
}

interface LeadFormProps {
  lead: Lead | null;
  loading: boolean;
  errorMessage?: string;
  onSubmit: (values: LeadFormValues) => void;
  onCancel: () => void;
}

const emptyValues: LeadFormValues = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  estado: "nuevo",
  notas: "",
};

export default function LeadForm({ lead, loading, errorMessage, onSubmit, onCancel }: LeadFormProps) {
  const form = useForm<LeadFormValues>({
    initialValues: emptyValues,
    validate: {
      nombre: (value) => (value.trim() ? null : "El nombre es obligatorio"),
      email: (value) => value.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Introduce un email válido",
    },
  });

  const statusOptions = lead?.estado === "convertido"
    ? [{ value: "convertido", label: statusLabels.convertido }]
    : leadStatuses.filter((status) => status !== "convertido").map((status) => ({ value: status, label: statusLabels[status] }));

  useEffect(() => {
    form.setValues(lead ? {
      nombre: lead.nombre,
      empresa: lead.empresa ?? "",
      email: lead.email ?? "",
      telefono: lead.telefono ?? "",
      estado: lead.estado,
      notas: lead.notas ?? "",
    } : emptyValues);
    form.resetDirty();
  }, [lead]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="lg">
        {errorMessage && <Alert color="red" icon={<IconAlertCircle size={18} />}>{errorMessage}</Alert>}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput label="Nombre" withAsterisk placeholder="Nombre del lead" {...form.getInputProps("nombre")} />
          <TextInput label="Empresa" placeholder="Empresa" {...form.getInputProps("empresa")} />
          <TextInput label="Email" type="email" placeholder="contacto@empresa.com" {...form.getInputProps("email")} />
          <TextInput label="Teléfono" type="tel" placeholder="600 000 000" className="lead-phone-field" {...form.getInputProps("telefono")} />
          <Select
            label="Estado"
            data={statusOptions}
            disabled={lead?.estado === "convertido"}
            className="lead-status-field"
            {...form.getInputProps("estado")}
          />
        </SimpleGrid>
        <Textarea label="Notas" placeholder="Añade contexto comercial o próximos pasos" minRows={4} {...form.getInputProps("notas")} />
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" type="button" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" loading={loading}>{lead ? "Guardar cambios" : "Guardar lead"}</Button>
        </Group>
      </Stack>
    </form>
  );
}
