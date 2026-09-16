/* ================================================================
   Service worker — Plan Mathilde
   Portée volontairement étroite : on n'intercepte que les ressources
   du plan. Tout le reste du site, et surtout les appels au webhook
   Google, passent directement au réseau sans jamais être mis en cache.
   ================================================================ */

const CACHE = 'mrun-mathilde-v9';

// Ressources mises en cache à l'installation. Les query strings ?v= sont
// conservées : changer une version invalide naturellement l'entrée.
const SHELL = [
  '/mathilde.html',
  '/assets/css/plan.css?v=1.0',
  '/assets/css/plan-mathilde.css?v=7.0',
  '/assets/js/plan-mathilde-data.js?v=3.0',
  '/assets/js/plan-mathilde-comp-data.js?v=1.0',
  '/assets/js/plan-mathilde-reperes-data.js?v=2.0',
  '/assets/js/plan-mathilde-suivi-data.js?v=1.0',
  '/assets/js/plan-mathilde-suivi.js?v=4.0',
  '/assets/js/plan-mathilde.js?v=5.1',
  '/public/icons/icon-192-v2.png',
  '/public/icons/apple-touch-icon-v2.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // addAll échoue en bloc si une seule ressource manque : on tolère
      // les absences pour ne jamais casser l'installation.
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('mrun-mathilde-') && k !== CACHE)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }

  // Hors de notre domaine : Google Apps Script, Google Fonts… on laisse passer.
  if (url.origin !== self.location.origin) return;

  const p = url.pathname;
  const concerne = p === '/mathilde.html'
    || p === '/mathilde'
    || p.startsWith('/assets/')
    || p.startsWith('/public/icons/');
  if (!concerne) return;   // le reste du site n'est pas de notre ressort

  // La page elle-même : réseau d'abord, pour ne jamais servir un plan périmé.
  if (p === '/mathilde.html' || p === '/mathilde') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/mathilde.html', copy));
          return res;
        })
        .catch(() => caches.match('/mathilde.html'))
    );
    return;
  }

  // Assets versionnés par ?v= : cache d'abord, c'est immuable à version égale.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
