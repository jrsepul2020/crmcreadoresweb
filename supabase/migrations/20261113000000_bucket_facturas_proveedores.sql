-- Bucket privado para guardar las facturas que emiten los proveedores.
-- Ejecutar una vez en Supabase → SQL Editor. Es idempotente: se puede repetir sin problema.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'facturas-proveedores', 'facturas-proveedores', false, 20971520,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Solo los usuarios con sesión iniciada pueden ver, subir, modificar y borrar archivos de este bucket.
drop policy if exists "facturas-proveedores: leer" on storage.objects;
drop policy if exists "facturas-proveedores: subir" on storage.objects;
drop policy if exists "facturas-proveedores: modificar" on storage.objects;
drop policy if exists "facturas-proveedores: borrar" on storage.objects;

create policy "facturas-proveedores: leer" on storage.objects
  for select to authenticated using (bucket_id = 'facturas-proveedores');
create policy "facturas-proveedores: subir" on storage.objects
  for insert to authenticated with check (bucket_id = 'facturas-proveedores');
create policy "facturas-proveedores: modificar" on storage.objects
  for update to authenticated using (bucket_id = 'facturas-proveedores') with check (bucket_id = 'facturas-proveedores');
create policy "facturas-proveedores: borrar" on storage.objects
  for delete to authenticated using (bucket_id = 'facturas-proveedores');
