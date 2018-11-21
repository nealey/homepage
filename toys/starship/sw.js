var cacheName = "starship-v1";
var content = [
  "index.html",
  "starship.js"
];


self.addEventListener("install", e => {
  e.waitUntil(caches.Open(cacheName).then(cache => cache.addAll(content)));
});

// Have mercy, this is a horror show
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      console.log("[Service Worker] Fetching resource:", e.request.url);
      return r || fetch(e.request).then(response => {
        return caches.open(cacheName).then(cache => {
          console.log("[Service Worker] Caching new resource:", e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});