import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// CLIENTES
app.get("/clientes", async (req, res) => {
  const data = await prisma.cliente.findMany();
  res.json(data);
});
app.post("/clientes", async (req, res) => {
  const data = await prisma.cliente.create({ data: req.body });
  res.json(data);
});
app.put("/clientes/:id", async (req, res) => {
  const data = await prisma.cliente.update({ where: { id: req.params.id }, data: req.body });
  res.json(data);
});
app.delete("/clientes/:id", async (req, res) => {
  await prisma.cliente.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// PROVEEDORES
app.get("/proveedores", async (req, res) => {
  const data = await prisma.proveedor.findMany();
  res.json(data);
});
app.post("/proveedores", async (req, res) => {
  const data = await prisma.proveedor.create({ data: req.body });
  res.json(data);
});
app.put("/proveedores/:id", async (req, res) => {
  const data = await prisma.proveedor.update({ where: { id: req.params.id }, data: req.body });
  res.json(data);
});
app.delete("/proveedores/:id", async (req, res) => {
  await prisma.proveedor.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// PRODUCTOS
app.get("/productos", async (req, res) => {
  const data = await prisma.producto.findMany();
  res.json(data);
});
app.post("/productos", async (req, res) => {
  const data = await prisma.producto.create({ data: req.body });
  res.json(data);
});
app.put("/productos/:id", async (req, res) => {
  const data = await prisma.producto.update({ where: { id: req.params.id }, data: req.body });
  res.json(data);
});
app.delete("/productos/:id", async (req, res) => {
  await prisma.producto.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// PROYECTOS
app.get("/proyectos", async (req, res) => {
  const data = await prisma.proyecto.findMany({ include: { cliente: true, tareas: true } });
  res.json(data);
});
app.post("/proyectos", async (req, res) => {
  const data = await prisma.proyecto.create({ data: req.body });
  res.json(data);
});
app.put("/proyectos/:id", async (req, res) => {
  const data = await prisma.proyecto.update({ where: { id: req.params.id }, data: req.body });
  res.json(data);
});
app.delete("/proyectos/:id", async (req, res) => {
  await prisma.proyecto.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// TAREAS
app.get("/tareas", async (req, res) => {
  const data = await prisma.tarea.findMany();
  res.json(data);
});
app.post("/tareas", async (req, res) => {
  const data = await prisma.tarea.create({ data: req.body });
  res.json(data);
});
app.put("/tareas/:id", async (req, res) => {
  const data = await prisma.tarea.update({ where: { id: req.params.id }, data: req.body });
  res.json(data);
});
app.delete("/tareas/:id", async (req, res) => {
  await prisma.tarea.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// PRESUPUESTOS
app.get("/presupuestos", async (req, res) => {
  const data = await prisma.presupuesto.findMany({ include: { cliente: true } });
  res.json(data);
});
app.post("/presupuestos", async (req, res) => {
  const data = await prisma.presupuesto.create({ data: req.body });
  res.json(data);
});
app.put("/presupuestos/:id", async (req, res) => {
  const data = await prisma.presupuesto.update({ where: { id: req.params.id }, data: req.body });
  res.json(data);
});
app.delete("/presupuestos/:id", async (req, res) => {
  await prisma.presupuesto.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));