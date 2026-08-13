import { useState } from "react";
import { Table, Button, Modal, TextInput, Select, Group, ActionIcon, Title, Stack } from "@mantine/core";
import { IconTrash, IconPlus } from "@tabler/icons-react";
import { useTareas, useCrearTarea, useEliminarTarea } from "../api/tareas";
import { useProyectos } from "../api/proyectos";

export default function TareasPage() {
  const { data: tareas, isLoading } = useTareas();
  const { data: proyectos } = useProyectos();
  const crear = useCrearTarea();
  const eliminar = useEliminarTarea();
  const [opened, setOpened] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [proyectoId, setProyectoId] = useState<string | null>(null);

  const handleCrear = () => {
    if (!proyectoId) return;
    crear.mutate({ titulo, estado, proyectoId }, {
      onSuccess: () => {
        setOpened(false);
        setTitulo("");
        setEstado("pendiente");
        setProyectoId(null);
      },
    });
  };

  const proyectoOptions = proyectos?.map((p) => ({ value: p.id, label: p.nombre })) ?? [];
  const nombreProyecto = (id: string) => proyectos?.find((p) => p.id === id)?.nombre ?? id;

  return (
    <Stack p="md">
      <Group justify="space-between">
        <Title order={2}>Tareas</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={() => setOpened(true)}>
          Nueva tarea
        </Button>
      </Group>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Título</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Proyecto</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tareas?.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>{t.titulo}</Table.Td>
                <Table.Td>{t.estado}</Table.Td>
                <Table.Td>{nombreProyecto(t.proyectoId)}</Table.Td>
                <Table.Td>
                  <ActionIcon color="red" onClick={() => eliminar.mutate(t.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={() => setOpened(false)} title="Nueva tarea">
        <Stack>
          <TextInput label="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <Select
            label="Estado"
            data={["pendiente", "en_progreso", "completada"]}
            value={estado}
            onChange={(v) => setEstado(v ?? "pendiente")}
          />
          <Select
            label="Proyecto"
            placeholder="Selecciona un proyecto"
            data={proyectoOptions}
            value={proyectoId}
            onChange={setProyectoId}
            searchable
          />
          <Button onClick={handleCrear} loading={crear.isPending} disabled={!proyectoId}>
            Guardar
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}