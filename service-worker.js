var dataCacheName = 'productData-v2';
var cacheName = 'productData-1';
 
var filesToCache = [
  '/'
  '/pwa-sample/',
  '/pwa-sample/app.js',
  '/pwa-sample/grid.css',
  '/pwa-sample/watch-list.html',
  '/pwa-sample/favicon.ico',
  '/pwa-sample/ziggo_logo.png'
];

self.addEventListener('push', function(event) {
 
  console.log('Received a push message', event);
  var notificationOptions = {
    body: 'Hello everybody!',
    //icon: './images/hipstercat.jpg',
    tag: 'simple-push-demo-notification'
  };
  return self.registration.showNotification('Important message', notificationOptions);
}); 

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
            
            /*caches.open('mysite-dynamic').then(function(cache) {
              return cache.match(event.request).then(function(response) {
                var fetchPromise = fetch(event.request).then(function(networkResponse) {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                })
                return response || fetchPromise;
              })
            })*/
            //return fetch(e.request);
                fetch(e.request).then(function(response) {
                  // delete old cache and get new data and save it in cache
                  return caches.open(dataCacheName).then(function(cache) {
                    cache.put(e.request.url, response.clone());
                    console.log('[ServiceWorker] Fetched&Cached Data');
                    return response;
                  });
                })
        })
    );
});
