-- "Enviada al cliente": hasta entonces se pueden corregir fechas de emisión y cobro; después quedan bloqueadas.
-- Ya aplicada en Supabase (columna "enviadaAt", trigger proteger_factura_emitida actualizado y guarda de fecha en "Pago").
alter table "Factura" add column if not exists "enviadaAt" timestamptz;
