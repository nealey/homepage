// jshint asi:true

var cacheName = "v1";
var content = [
  "index.html",
  "app.js",
  "app.css",
  "app.svg",
]


self.addEventListener("install", preCache)
self.addEventListener("fetch", cachingFetch)
self.addEventListener("activate", handleActivate)

async function cleanup(event) {
  let cacheNames = await caches.keys()
  for (let name of cacheNames) {
    if (name != cacheName) {
      console.log("Deleting old cache", name)
      caches.delete(name)
    }
  }
}

function handleActivate(event){
  event.waitUntil(cleanup())
}


function preCache(event) {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(content))
  )
}

// Go try to pull a newer version from the network,
// but return what's in the cache for this request
async function cachingFetch(event) {
  let resp = await fetch(event.request)
  let cache = await caches.open(cacheName)
  cache.put(event.request, resp.clone())
  
  event.respondWith(caches.match(event.request))
}
