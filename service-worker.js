var dataCacheName = 'productData-v1';
var cacheName = 'productData-1';
var filesToCache = [
  '/pwa-sample/',
  '/pwa-sample/app.js',
  '/pwa-sample/grid.css',
  '/pwa-sample/myPrime.json'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  // either respond with the cached object or go ahead and fetch the actual url
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            //return fetch(e.request);
                fetch(e.request).then(function(response) {
                  return caches.open(dataCacheName).then(function(cache) {
                    cache.put(e.request.url, response.clone());
                    console.log('[ServiceWorker] Fetched&Cached Data');
                    return response;
                  });
                })
        })
    );
});
