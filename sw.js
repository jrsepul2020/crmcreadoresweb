// Service worker de la PWA: permite instalar la app y abrirla aunque no haya conexión.
// - Navegación (index.html): red primero, caché como respaldo, para que los despliegues nuevos se vean enseguida.
// - Librerías y fuentes externas (CDN) e iconos: caché con actualización en segundo plano.
// - Supabase (datos, auth, storage) nunca se cachea: siempre va a la red.
const VERSION = 'v2';
const SHELL = `crm-shell-${VERSION}`;
const RUNTIME = `crm-runtime-${VERSION}`;
const PRECACHE = ['./', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![SHELL, RUNTIME].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in')) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copia = res.clone();
        caches.open(SHELL).then((c) => c.put('./', copia));
        return res;
      }).catch(() => caches.match('./'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cacheada) => {
      const red = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copia = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copia));
        }
        return res;
      }).catch(() => cacheada);
      return cacheada || red;
    })
  );
});
