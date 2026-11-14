-- Bucket privado con la copia en PDF de cada factura emitida a clientes (<año>/<número>.pdf).
-- Solo se permite leer y subir: no hay políticas de modificar ni borrar, para conservar la factura tal y como se emitió.
-- Idempotente: se puede ejecutar varias veces.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('facturas-clientes', 'facturas-clientes', false, 10485760, array['application/pdf'])
on conflict (id) do update
  set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "facturas-clientes: leer" on storage.objects;
drop policy if exists "facturas-clientes: subir" on storage.objects;

create policy "facturas-clientes: leer" on storage.objects
  for select to authenticated using (bucket_id = 'facturas-clientes');
create policy "facturas-clientes: subir" on storage.objects
  for insert to authenticated with check (bucket_id = 'facturas-clientes');
