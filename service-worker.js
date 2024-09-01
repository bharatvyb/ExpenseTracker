// Basic service worker setup
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'common.css', // Add common.css to the cache
        'record.css',
        'record.js',
        'settings.css',
        'settings.js',
        'monthly.css',
        'monthly.js',
        'total.css',
        'total.js',
        'manage_categories.css',
        'manage_categories.js',
        'manage_categories.html',
        'manage_payment_methods.css',
        'manage_payment_methods.js',
        'manage_payment_methods.html',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});