const cacheName = "batCache";
const contentToCache = [
    "./index.html",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/maskable_icon.png",
];


self.addEventListener("install", (e) => {
    console.log("[Service Worker] Install");
    e.waitUntil(
      (async () => {
        const cache = await caches.open(cacheName);
        console.log("[Service Worker] Caching all: app shell and content");
        await cache.addAll(contentToCache);
      })(),
    );
  });

self.addEventListener("fetch", (e) => {
    if(!e.request.url.startsWith("http")){return;}
    e.respondWith(
        fetch(e.request).then(async (response)=>{
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Fetched from network, caching new resource ${e.request.url}`);
            console.put(e.request,response.clone());
            return response;
        }
        ).catch(async () =>{
            const r = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource from cache: ${e.request.url}`);
            return r;
        }))
});
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key === cacheName) {
                    return;
                }
                return caches.delete(key);
                }),
            );
        }),
    );
});