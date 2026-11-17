-- Configuración fiscal guardada una sola vez (se usa en el resumen trimestral)
alter table "Empresa"
  add column if not exists "regimenIrpf" text not null default 'estimacion_directa_simplificada',
  add column if not exists "regimenIva" text not null default 'general',
  add column if not exists "situacionAnioAnterior" text not null default 'sin_actividad',
  add column if not exists "minoracion130" numeric not null default 0;
