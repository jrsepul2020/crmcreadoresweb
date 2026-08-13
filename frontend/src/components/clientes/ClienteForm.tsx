import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Alert, Button, Group, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { Cliente } from "../../api/clientes";

export interface ClienteFormValues {
  nombre: string;
  email: string;
  telefono: string;
  nif: string;
  empresa: string;
  personaContacto: string;
  direccion: string;
  codigoPostal: string;
  poblacion: string;
  provincia: string;
  notas: string;
}

interface ClienteFormProps {
  cliente: Cliente | null;
  loading: boolean;
  errorMessage?: string;
  onSubmit: (values: ClienteFormValues) => void;
  onCancel: () => void;
}

const emptyValues: ClienteFormValues = {
  nombre: "",
  personaContacto: "",
  empresa: "",
  nif: "",
  email: "",
  telefono: "",
  direccion: "",
  codigoPostal: "",
  poblacion: "",
  provincia: "",
  notas: "",
};

export default function ClienteForm({ cliente, loading, errorMessage, onSubmit, onCancel }: ClienteFormProps) {
  const form = useForm<ClienteFormValues>({
    initialValues: emptyValues,
    validate: {
      nombre: (value) => (value.trim().length > 0 ? null : "El nombre es obligatorio"),
      email: (value) => (
        value.trim().length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? null
          : "Introduce un email válido"
      ),
      nif: (value) => (
        value.trim().length === 0 || /^[A-Za-z0-9 -]{5,20}$/.test(value)
          ? null
          : "Introduce un NIF o CIF válido"
      ),
    },
  });

  useEffect(() => {
    form.setValues(cliente ? {
      nombre: cliente.nombre,
      personaContacto: cliente.personaContacto ?? "",
      empresa: cliente.empresa ?? "",
      nif: cliente.nif ?? "",
      email: cliente.email ?? "",
      telefono: cliente.telefono ?? "",
      direccion: cliente.direccion ?? "",
      codigoPostal: cliente.codigoPostal ?? "",
      poblacion: cliente.poblacion ?? "",
      provincia: cliente.provincia ?? "",
      notas: cliente.notas ?? "",
    } : emptyValues);
    form.resetDirty();
  }, [cliente]);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack gap="lg">
        {errorMessage && <Alert color="red" icon={<IconAlertCircle size={18} />}>{errorMessage}</Alert>}
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Datos del cliente</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="client-form-grid">
          <TextInput label="Nombre" withAsterisk placeholder="Nombre del cliente" {...form.getInputProps("nombre")} />
          <TextInput label="Persona de contacto" placeholder="Persona de contacto" {...form.getInputProps("personaContacto")} />
        </SimpleGrid>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Datos de empresa</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="client-form-grid">
          <TextInput label="Empresa" placeholder="Empresa o razón social" {...form.getInputProps("empresa")} />
          <TextInput label="NIF / CIF" placeholder="B12345678" className="client-nif-field" {...form.getInputProps("nif")} />
        </SimpleGrid>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Contacto</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="client-form-grid">
          <TextInput label="Email" type="email" placeholder="cliente@empresa.com" {...form.getInputProps("email")} />
          <TextInput label="Teléfono" type="tel" placeholder="600 000 000" className="client-phone-field" {...form.getInputProps("telefono")} />
        </SimpleGrid>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Datos de facturación</Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" className="client-form-grid">
          <TextInput label="Dirección" placeholder="Dirección de facturación" className="client-address-field" {...form.getInputProps("direccion")} />
          <TextInput label="Código postal" placeholder="28001" className="client-postal-field" {...form.getInputProps("codigoPostal")} />
          <TextInput label="Población" placeholder="Madrid" className="client-city-field" {...form.getInputProps("poblacion")} />
          <TextInput label="Provincia" placeholder="Madrid" className="client-province-field" {...form.getInputProps("provincia")} />
        </SimpleGrid>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed">Notas</Text>
        <Textarea label="Notas" placeholder="Notas internas del cliente" minRows={4} {...form.getInputProps("notas")} />
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onCancel} type="button">Cancelar</Button>
          <Button type="submit" loading={loading}>{cliente ? "Guardar cambios" : "Guardar cliente"}</Button>
        </Group>
      </Stack>
    </form>
  );
}
