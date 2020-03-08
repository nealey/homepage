var cacheName = "convulse-v1";
var content = [
  "index.html",
  "convulse.css",
  "convulse.js",
  "convulse.png"
];


self.addEventListener("install", e => {
  e.waitUntil(caches.Open(cacheName).then(cache => cache.addAll(content)));
});

// Have mercy, this is a horror show
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      return r || fetch(e.request).then(response => {
        return caches.open(cacheName).then(cache => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
