const CACHE = "portoqr-v1";
const ASSETS = [
  "/guardia.html",
  "/index.html",
  "/manifest.json"
];

// Instalar — cachear assets principales
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar — limpiar caches viejos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener("fetch", e => {
  // No cachear requests a Supabase
  if (e.request.url.includes("supabase.co")) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guardar en cache si es exitoso
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
