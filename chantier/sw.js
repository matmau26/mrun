/* Mode hors ligne : l'outil se met en mémoire à la première visite.
   En ligne, on prend toujours la dernière version ; hors ligne, celle en mémoire.
   L'outil n'appelle aucun service externe. */
const CACHE = 'olympe-v7';
const SHELL = [
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'js/vendor/jspdf.umd.min.js',
  'js/config.js',
  'js/util.js',
  'js/clients.js',
  'js/pdf-kit.js',
  'js/doc-securite.js',
  'js/doc-reception.js',
  'js/doc-levee.js',
  'js/app.js',
  'assets/logo.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // Hors ligne, toute ouverture de l'outil (avec ou sans « index.html ») rend la page en mémoire
  const page = req.mode === 'navigate';
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => page ? caches.match('index.html')
        : caches.match(req, { ignoreSearch: true }))
  );
});
