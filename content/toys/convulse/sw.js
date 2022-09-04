// jshint asi:true

var cacheName = "v2";
var content = [
  "index.html",
  "convulse.css",
  "convulse.js",
  "convulse.png"
]


self.addEventListener("install", preCache)
self.addEventListener("fetch", cachingFetch)
self.addEventListener("activate", handleActivate)

function handleActivate(event){
  event.waitUntil(
    cleanup()
  )
}

async function cleanup(event) {
  let cacheNames = await caches.keys()
  for (let name of cacheNames) {
    if (name != cacheName) {
      console.log("Deleting old cache", name)
      caches.delete(name)
    }
  }
}

function preCache(event) {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(content))
  )
}

// Go try to pull a newer version from the network,
// but return what's in the cache for this request
function cachingFetch(event) {
  fetch(event.request)
  .then(resp => {
    caches.open(cacheName)
    .then(cache => {
      cache.put(event.request, resp.clone())
    })
  })
  
  event.respondWith(caches.match(event.request))
}
