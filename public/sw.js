
// Basic service worker for PWA (Progressive Web App)
// This is a very simple service worker for demonstration.
// For production, consider using Workbox or more advanced caching strategies.

const CACHE_NAME = 'livepick-cache-v1';
const urlsToCache = [
  '/',
  // Add other important static assets you want to cache initially
  // For example: '/_next/static/css/...', '/_next/static/chunks/...'
  // Be careful with dynamic Next.js assets, Workbox is better for this.
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache');
        // Add essential assets that are not part of Next.js build (like manifest, custom icons if any)
        // Next.js built-in assets are usually better handled by more sophisticated tools like next-pwa or Workbox
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/_next/')));
      })
      .catch(error => {
        console.error('[Service Worker] Cache addAll failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // console.log('[Service Worker] Fetching:', event.request.url);
  // Basic cache-first strategy for non-API GET requests
  if (event.request.method === 'GET' && !event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            // console.log('[Service Worker] Found in cache:', event.request.url);
            return response;
          }
          // console.log('[Service Worker] Not in cache, fetching from network:', event.request.url);
          return fetch(event.request).then(
            (networkResponse) => {
              // Optional: Cache new requests dynamically (be careful with this for Next.js pages)
              // if (networkResponse && networkResponse.status === 200 && !event.request.url.startsWith('chrome-extension://')) {
              //   const responseToCache = networkResponse.clone();
              //   caches.open(CACHE_NAME)
              //     .then(cache => {
              //       cache.put(event.request, responseToCache);
              //     });
              // }
              return networkResponse;
            }
          ).catch(error => {
            console.error('[Service Worker] Fetch failed; returning offline page if available or error for:', event.request.url, error);
            // You could return a generic offline page here from cache if 'offline.html' was cached.
            // return caches.match('/offline.html'); 
          });
        })
    );
  }
});
