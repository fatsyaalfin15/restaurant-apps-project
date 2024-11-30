import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { precacheAndRoute } from 'workbox-precaching';


precacheAndRoute(self.__WB_MANIFEST);


const STATIC_CACHE_NAME = 'restaurant-static-v2';
const API_CACHE_NAME = 'restaurant-api-cache-v2';
const IMAGE_CACHE_NAME = 'image-cache-v2';


self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event triggered');
  const cacheWhitelist = [STATIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});


registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: IMAGE_CACHE_NAME,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);


registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);


registerRoute(
  ({ request }) =>
    ['style', 'script', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
      }),
    ],
  })
);


registerRoute(
  ({ url }) =>
    url.origin === 'https://restaurant-api.dicoding.dev' && url.pathname.startsWith('/list'),
  new StaleWhileRevalidate({
    cacheName: API_CACHE_NAME,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.destination === 'document') {
            console.warn('[Service Worker] Returning fallback HTML');
            return caches.match('/fallback.html');
          } else if (event.request.destination === 'image') {
            console.warn('[Service Worker] Returning fallback image');
            return caches.match('/images/fallback-image.jpg');
          }
        })
      );
    })
  );
});
