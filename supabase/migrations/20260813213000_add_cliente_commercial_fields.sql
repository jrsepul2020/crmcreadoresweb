alter table public."Cliente"
  add column if not exists empresa text,
  add column if not exists "personaContacto" text,
  add column if not exists direccion text,
  add column if not exists "codigoPostal" text,
  add column if not exists poblacion text,
  add column if not exists provincia text,
  add column if not exists notas text;
