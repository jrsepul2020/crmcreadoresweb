alter table "Empresa"
  add column if not exists "rendimiento2025" numeric not null default 0,
  add column if not exists "aplicarMinoracion130" boolean not null default false;
update "Empresa" set "rendimiento2025" = 0, "minoracion130" = 100, "aplicarMinoracion130" = true;
