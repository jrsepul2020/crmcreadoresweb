-- Datos adicionales de la ficha de cliente: nombre y apellidos por separado (nombre sigue guardando el nombre completo),
-- cargo, país, email de facturación y campos de CRM (servicio de interés, origen del lead, etiquetas).
-- Ya aplicada en Supabase; se guarda aquí como registro.
alter table "Cliente"
  add column if not exists "nombrePila" text,
  add column if not exists "apellidos" text,
  add column if not exists "cargo" text,
  add column if not exists "pais" text,
  add column if not exists "emailFacturacion" text,
  add column if not exists "servicioInteres" text,
  add column if not exists "origenLead" text,
  add column if not exists "etiquetas" text[] not null default '{}';
