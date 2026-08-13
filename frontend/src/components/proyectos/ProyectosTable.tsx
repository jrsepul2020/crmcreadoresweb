import { Button, Center, Group, Menu, Paper, Skeleton, Table, Text } from "@mantine/core";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import type { Proyecto } from "../../api/proyectos";
import ProyectoStatusBadge from "./ProyectoStatusBadge";

interface ProyectosTableProps {
  proyectos: Proyecto[];
  clientes: Record<string, string>;
  tareas: Record<string, number>;
  loading: boolean;
  onEdit: (proyecto: Proyecto) => void;
  onDelete: (proyecto: Proyecto) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function Actions({ proyecto, onEdit, onDelete }: { proyecto: Proyecto; onEdit: (proyecto: Proyecto) => void; onDelete: (proyecto: Proyecto) => void }) {
  return <Menu shadow="sm" position="bottom-end" withinPortal><Menu.Target><Button variant="subtle" color="gray" size="compact-sm" aria-label={`Acciones de ${proyecto.nombre}`} px={6}><IconDots size={18} /></Button></Menu.Target><Menu.Dropdown><Menu.Item component={Link} to={`/proyectos/${proyecto.id}`} leftSection={<IconEye size={16} />}>Ver proyecto</Menu.Item><Menu.Item onClick={() => onEdit(proyecto)} leftSection={<IconEdit size={16} />}>Editar</Menu.Item><Menu.Divider /><Menu.Item color="red" onClick={() => onDelete(proyecto)} leftSection={<IconTrash size={16} />}>Eliminar</Menu.Item></Menu.Dropdown></Menu>;
}

function SkeletonRows() {
  return <>{Array.from({ length: 5 }, (_, index) => <Table.Tr key={index}>{Array.from({ length: 7 }, (_, cell) => <Table.Td key={cell}><Skeleton height={16} width={cell === 0 ? "70%" : 90} /></Table.Td>)}</Table.Tr>)}</>;
}

export default function ProyectosTable({ proyectos, clientes, tareas, loading, onEdit, onDelete }: ProyectosTableProps) {
  return <>
    <div className="projects-table-shell"><Table className="projects-table" verticalSpacing="sm"><Table.Thead><Table.Tr><Table.Th>Proyecto</Table.Th><Table.Th>Cliente</Table.Th><Table.Th>Estado</Table.Th><Table.Th>Fecha inicio</Table.Th><Table.Th>Fecha prevista</Table.Th><Table.Th>Tareas</Table.Th><Table.Th>Acciones</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{loading ? <SkeletonRows /> : proyectos.map((proyecto) => <Table.Tr key={proyecto.id}><Table.Td><Text component={Link} to={`/proyectos/${proyecto.id}`} fw={650} className="project-name-link">{proyecto.nombre}</Text></Table.Td><Table.Td><Text truncate>{clientes[proyecto.clienteId] || "—"}</Text></Table.Td><Table.Td><ProyectoStatusBadge status={proyecto.estado} /></Table.Td><Table.Td><Text size="sm" c="dimmed">{formatDate(proyecto.fechaInicio)}</Text></Table.Td><Table.Td><Text size="sm" c="dimmed">{formatDate(proyecto.fechaPrevista)}</Text></Table.Td><Table.Td>{tareas[proyecto.id] ?? 0}</Table.Td><Table.Td><Actions proyecto={proyecto} onEdit={onEdit} onDelete={onDelete} /></Table.Td></Table.Tr>)}</Table.Tbody></Table>{!loading && !proyectos.length && <Center py="xl"><Text size="sm" c="dimmed">No hay proyectos que coincidan con los filtros.</Text></Center>}</div>
  </>;
}
