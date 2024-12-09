const CACHE_NAME = 'map-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.js',
    '/https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
