/* Service worker de la page privée UTV26 — portée limitée à cette seule page
   (enregistré avec scope = son propre chemin).

   Stratégie « réseau d'abord » : en ligne, on sert toujours la réponse du
   serveur, donc jamais de version périmée ; hors ligne, on retombe sur la
   dernière copie mise en cache. La page n'a aucune dépendance externe : ce
   fichier ne sert qu'à pouvoir la recharger sans réseau. */
var CACHE = 'utv26';

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.add(new Request(self.registration.scope, { cache: 'reload' })); })
      .catch(function () {})
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      if (r && r.ok && r.type !== 'opaque') {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); }).catch(function () {});
      }
      return r;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
        return hit || caches.match(self.registration.scope);
      });
    })
  );
});
