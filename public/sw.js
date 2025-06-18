// Basic Service Worker for PWA (placeholder)
// In a real app, use Workbox or a more robust caching strategy.

const CACHE_NAME = 'swiftserve-cache-v1';
const urlsToCache = [
  '/',
  '/globals.css', // Assuming your main CSS is here or linked from index
  // Add other critical static assets: logo, main JS bundles if known and static
  // Note: Next.js handles its own JS chunk caching effectively.
  // This is more for very basic offline fallback for the shell.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened SwiftServe cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache on install:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  // Basic cache-first strategy for assets in urlsToCache
  // For other requests (like API calls, dynamic pages), it will go to network.
  // A more advanced SW would handle these differently (e.g., networkFirst, staleWhileRevalidate).
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      })
      .catch(err => {
        console.error('Fetch error/cache miss:', err, event.request.url);
        // Optionally, return a generic offline page here for navigation requests
        // if (event.request.mode === 'navigate') {
        //   return caches.match('/offline.html'); // You'd need to create an offline.html
        // }
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old SwiftServe cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
