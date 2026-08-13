create table public."Lead" (
  id text primary key default gen_random_uuid()::text,
  nombre text not null,
  email text,
  telefono text,
  empresa text,
  notas text,
  estado text not null default 'nuevo',
  "createdAt" timestamp without time zone not null default current_timestamp,
  "fechaConversion" timestamp without time zone,
  "clienteId" text references public."Cliente" (id),
  constraint "Lead_estado_check"
    check (estado in ('nuevo', 'contactado', 'calificado', 'propuesta_enviada', 'convertido', 'perdido'))
);

alter table public."Lead" enable row level security;

create policy "Lead_authenticated_full_access"
on public."Lead"
for all
to authenticated
using (true)
with check (true);
