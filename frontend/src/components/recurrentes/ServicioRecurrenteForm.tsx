import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Alert, Button, Group, NumberInput, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Cliente } from "../../api/clientes";
import type { Producto } from "../../api/productos";
import type { Periodicidad, ServicioRecurrente, ServicioRecurrenteEstado } from "../../api/serviciosRecurrentes";
import { labels } from "./ServicioRecurrenteStatusBadge";

export interface ServicioRecurrenteFormValues {
  clienteId: string | null;
  productoId: string | null;
  descripcion: string;
  precio: number | string;
  periodicidad: Periodicidad;
  fechaInicio: string;
  proximaRenovacion: string;
  estado: ServicioRecurrenteEstado;
  notas: string;
}

interface Props {
  servicio: ServicioRecurrente | null;
  clientes: Cliente[];
  productos: Producto[];
  clienteInicial?: string | null;
  loading: boolean;
  errorMessage?: string;
  onSubmit: (values: ServicioRecurrenteFormValues) => void;
  onCancel: () => void;
}

const emptyValues: ServicioRecurrenteFormValues = { clienteId: null, productoId: null, descripcion: "", precio: "", periodicidad: "anual", fechaInicio: "", proximaRenovacion: "", estado: "activo", notas: "" };
const periodicityOptions = [
  { value: "mensual", label: "Mensual" },
  { value: "trimestral", label: "Trimestral" },
  { value: "anual", label: "Anual" },
];
const statusOptions = (Object.keys(labels) as ServicioRecurrenteEstado[]).map((value) => ({ value, label: labels[value] }));

export default function ServicioRecurrenteForm({ servicio, clientes, productos, clienteInicial, loading, errorMessage, onSubmit, onCancel }: Props) {
  const form = useForm<ServicioRecurrenteFormValues>({
    initialValues: emptyValues,
    validate: {
      clienteId: (value) => value ? null : "Selecciona un cliente",
      descripcion: (value) => value.trim() ? null : "La descripción es obligatoria",
      precio: (value) => Number(value) >= 0 && value !== "" ? null : "Introduce un precio válido",
      fechaInicio: (value) => value ? null : "Indica la fecha de inicio",
      proximaRenovacion: (value, values) => !value ? "Indica la próxima renovación" : values.fechaInicio && value < values.fechaInicio ? "Debe ser posterior a la fecha de inicio" : null,
    },
  });

  useEffect(() => {
    form.setValues(servicio ? {
      clienteId: servicio.clienteId,
      productoId: servicio.productoId ?? null,
      descripcion: servicio.descripcion,
      precio: servicio.precio,
      periodicidad: servicio.periodicidad,
      fechaInicio: servicio.fechaInicio,
      proximaRenovacion: servicio.proximaRenovacion,
      estado: servicio.estado,
      notas: servicio.notas ?? "",
    } : { ...emptyValues, clienteId: clienteInicial ?? null });
    form.resetDirty();
  }, [clienteInicial, servicio]);

  const productOptions = productos.map((product) => ({ value: product.id, label: product.nombre }));
  const clientOptions = clientes.map((client) => ({ value: client.id, label: client.empresa || client.nombre }));
  const handleProductChange = (value: string | null) => {
    form.setFieldValue("productoId", value);
    const product = productos.find((item) => item.id === value);
    if (product && !form.values.descripcion) form.setFieldValue("descripcion", product.nombre);
    if (product && form.values.precio === "") form.setFieldValue("precio", product.precio);
  };

  return <form onSubmit={form.onSubmit(onSubmit)}><Stack gap="lg">
    {errorMessage && <Alert color="red" icon={<IconAlertCircle size={18} />}>{errorMessage}</Alert>}
    <Text size="xs" fw={700} tt="uppercase" c="dimmed">Datos del servicio</Text>
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      <Select label="Cliente" withAsterisk placeholder="Selecciona un cliente" data={clientOptions} searchable disabled={Boolean(clienteInicial && !servicio)} {...form.getInputProps("clienteId")} />
      <Select label="Producto" placeholder="Opcional" data={productOptions} searchable clearable value={form.values.productoId} onChange={handleProductChange} />
      <TextInput label="Descripción" withAsterisk placeholder="Hosting anual" className="recurring-description-field" {...form.getInputProps("descripcion")} />
      <NumberInput label="Precio" min={0} decimalScale={2} fixedDecimalScale suffix=" €" placeholder="0,00" className="recurring-price-field" {...form.getInputProps("precio")} />
      <Select label="Periodicidad" data={periodicityOptions} className="recurring-short-field" {...form.getInputProps("periodicidad")} />
      <Select label="Estado" data={statusOptions} className="recurring-short-field" {...form.getInputProps("estado")} />
      <TextInput label="Fecha de inicio" type="date" className="recurring-date-field" {...form.getInputProps("fechaInicio")} />
      <TextInput label="Próxima renovación" type="date" className="recurring-date-field" {...form.getInputProps("proximaRenovacion")} />
    </SimpleGrid>
    <Textarea label="Notas" placeholder="Notas internas del servicio" minRows={5} {...form.getInputProps("notas")} />
    <Group justify="flex-end" gap="sm"><Button variant="subtle" type="button" onClick={onCancel}>Cancelar</Button><Button type="submit" loading={loading}>{servicio ? "Guardar cambios" : "Crear servicio"}</Button></Group>
  </Stack></form>;
}
