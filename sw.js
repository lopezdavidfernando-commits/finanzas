// Service worker: permite abrir la app sin internet.
// Estrategia "primero la red": con conexión siempre se carga la última versión publicada;
// la copia guardada solo se usa sin conexión. Así las actualizaciones llegan solas.
var CACHE = 'finanzas-v2';
var SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.json',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  // Fuentes de Google: guardadas una vez, sirven offline
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      });
    }));
    return;
  }

  // Todo lo demás de otros dominios (Drive, login de Google) pasa directo, sin guardar
  if (url.origin !== self.location.origin) return;

  // cache: 'no-cache' → siempre pregunta al servidor si hay versión nueva (sin esperar los 10 min de GitHub).
  // Se arma una petición nueva con la URL: pasar opciones a una navegación directamente lanza error.
  var fresh = new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' });
  e.respondWith(fetch(fresh).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined);
    });
  }));
});
