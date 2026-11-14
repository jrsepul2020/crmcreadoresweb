-- Permite corregir la fecha de emisión de una factura ya emitida (el resto de campos fiscales siguen bloqueados).
create or replace function public.proteger_factura_emitida() returns trigger
language plpgsql set search_path to 'public' as $function$
begin
  if tg_op = 'DELETE' then
    if old.estado <> 'borrador' then
      raise exception 'No se puede borrar la factura % porque ya está emitida. Crea una factura rectificativa.', old.numero;
    end if;
    return old;
  end if;

  if old.estado <> 'borrador' then
    if new.estado = 'borrador' then
      raise exception 'Una factura emitida no puede volver a borrador.';
    end if;
    if new.numero               is distinct from old.numero
    or new.serie                is distinct from old.serie
    or new."tipoFactura"        is distinct from old."tipoFactura"
    or new."clienteId"          is distinct from old."clienteId"
    or new."fechaOperacion"     is distinct from old."fechaOperacion"
    or new.subtotal             is distinct from old.subtotal
    or new."ivaTotal"           is distinct from old."ivaTotal"
    or new.descuento            is distinct from old.descuento
    or new.total                is distinct from old.total
    or new."retencionPorcentaje" is distinct from old."retencionPorcentaje"
    or new."retencionImporte"   is distinct from old."retencionImporte"
    or new."totalATransferir"   is distinct from old."totalATransferir"
    or new."sinIva"             is distinct from old."sinIva"
    or new."mencionIva"         is distinct from old."mencionIva"
    or new."facturaRectificadaId" is distinct from old."facturaRectificadaId"
    then
      raise exception 'La factura % ya está emitida y no se puede modificar. Crea una factura rectificativa.', old.numero;
    end if;
  end if;
  return new;
end $function$;
