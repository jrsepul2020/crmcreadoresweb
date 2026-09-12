# CRM Creadores Web

CRM a medida para la gestión de clientes, proyectos, presupuestos, facturas, proveedores, productos/servicios, leads y servicios recurrentes de la agencia.

## Cómo abrirlo

Es una aplicación web sin proceso de compilación (React + Supabase cargados por CDN). Dos formas de usarla:

**Opción rápida:** haz doble clic en `index.html` y ábrelo con tu navegador.

**Opción recomendada (evita problemas de algunos navegadores con archivos locales):**
1. Abre una terminal dentro de esta carpeta (`crm-app`).
2. Ejecuta: `python3 -m http.server 8080` (o `npx serve` si tienes Node).
3. Abre `http://localhost:8080` en el navegador.

Inicia sesión con tu usuario de Supabase: **jrsepul2000@gmail.com** (la contraseña es la que ya tenías configurada).

## Publicarlo en internet (opcional)

Como no necesita build, puedes subir la carpeta tal cual a cualquier hosting estático:
- **Netlify Drop**: arrastra la carpeta `crm-app` en https://app.netlify.com/drop
- **Vercel**, **GitHub Pages** o cualquier hosting compartido: sube el contenido de `crm-app` a la raíz del dominio/subdominio.

## Estructura del proyecto

```
crm-app/
  index.html          Punto de entrada, carga React/Supabase/Tailwind por CDN
  src/
    config.js          Conexión a Supabase (URL + clave pública)
    utils.js            Formateo de fechas/moneda, estados, cálculos de totales
    icons.js             Iconos SVG
    api.js                 Funciones CRUD genéricas contra Supabase
    components/
      ui.js               Componentes reutilizables (botones, modales, tablas...)
      Layout.js            Barra lateral y cabecera
    pages/
      Login.js, Dashboard.js, Calendario.js, Clientes.js, Proveedores.js, Productos.js,
      Proyectos.js, Presupuestos.js, Facturas.js, Leads.js, ServiciosRecurrentes.js,
      Gastos.js, Contabilidad.js, Ajustes.js
    App.js               Enrutado y control de sesión
```

## Base de datos

Proyecto de Supabase: **CRM CREADORES** (organización Creadores Web Sevilla).
Tablas: Cliente, ClienteAcceso, ClienteInteraccion, Proveedor, Producto, Proyecto, Tarea,
Presupuesto, PresupuestoItem, Factura, FacturaItem, Pago, Lead, ServicioRecurrente,
Gasto, Empresa. Todas con RLS activado (solo usuarios autenticados pueden leer/escribir).

## Funcionalidades incluidas

- **Clientes**: ficha completa (varios teléfonos/emails, dirección, notas), enlaces directos a email/WhatsApp/web, filtro por estado. Al pulsar sobre un cliente se abre directamente en edición, con tres pestañas: Datos generales, Accesos e Historial.
- **Accesos**: pestaña por cliente para guardar usuarios y contraseñas de hosting, email, redes sociales, etc., con opción de ocultar/mostrar y copiar.
- **Historial**: registro de llamadas, reuniones, emails y notas de seguimiento por cliente.
- **Calendario y avisos**: vista mensual con tareas, vencimientos de facturas, renovaciones y caducidad de presupuestos; campana de notificaciones en la cabecera con los avisos más urgentes.
- **Copiar rápido**: icono de copiar junto a nombre, email, teléfono y demás campos de contacto, en listados y formularios.
- **Leads**: listado con filtro por estado, conversión a cliente y creación de presupuesto con un clic.
- **Proyectos**: estado, prioridad, progreso, tareas con checklist integrado.
- **Presupuestos**: líneas de detalle con IVA, numeración automática, conversión directa a factura, PDF automático + email al guardar.
- **Facturas**: líneas de detalle, registro de pagos, aviso de gastos pendientes de repercutir, descarga de PDF.
- **Servicios recurrentes**: control de renovaciones mensuales/trimestrales/anuales, precio con IVA.
- **Productos y proveedores**: catálogo de servicios con precio, IVA y proveedor asociado.
- **Gastos**: hosting, dominios, software..., con opción de marcarlos como repercutibles a un cliente.
- **Contabilidad**: desglose mensual de facturado/cobrado/gastos/beneficio, listado de pagos recibidos.
- **Ajustes**: datos fiscales de la agencia, usados en la cabecera de los PDF.
- Colores e imagotipo de Creadores Web, diseño responsive (barra lateral colapsable, tablas con scroll horizontal).

### Sobre los Accesos guardados

Los usuarios y contraseñas de la pestaña "Accesos" se guardan en texto plano en la base de
datos, protegidos por las políticas de seguridad de Supabase (solo tu usuario autenticado
puede leerlos). Es razonable para un CRM de uso interno de una sola persona; si en el futuro
compartes el acceso al CRM con alguien más, convendría cifrar ese campo.

### Sobre el PDF y el envío por email

Al guardar un presupuesto nuevo se genera automáticamente su PDF (se descarga solo) y se
abre tu cliente de correo con destinatario, asunto y cuerpo ya rellenos. Los navegadores no
permiten adjuntar archivos a un email de forma automática por seguridad, así que el último
paso — arrastrar el PDF descargado al email — hay que hacerlo a mano. Si más adelante quieres
que se envíe solo, sin ese paso manual, hace falta contratar un servicio de envío transaccional
(por ejemplo Resend, con plan gratuito) y conectar su clave API.

Rellena tus datos fiscales en **Ajustes** para que aparezcan correctamente en los PDF.

## Notas técnicas

Al no poder acceder este entorno a los registros de npm, la app se construyó
sin paso de build, usando Babel en el navegador para transformar el JSX. Es
funcional y rápida para un CRM interno de una persona, pero si en el futuro
quieres pasarlo a un proyecto Vite compilado (mejor rendimiento, TypeScript,
tests, etc.), la lógica de `src/` se puede trasladar prácticamente tal cual.
