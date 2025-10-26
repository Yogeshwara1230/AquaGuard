// Define the cache name and the files to cache
const CACHE_NAME = 'aquaguard-cache-v1';
const urlsToCache = [
    './aquaguard_dashboard.html',
    './aquaguard.webmanifest',
    // We include the third-party libraries we rely on
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
    // Placeholder image for manifest icons (from aquaguard.webmanifest)
    'https://placehold.co/192x192/1D4ED8/ffffff?text=AG',
    'https://placehold.co/512x512/1D4ED8/ffffff?text=AG'
];

// --- INSTALLATION PHASE ---
// Caches all required assets upon first load.
self.addEventListener('install', (event) => {
    // console.log('[Service Worker] Install event triggered.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // console.log('[Service Worker] Caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

// --- ACTIVATION PHASE ---
// Cleans up old caches, ensuring users always get the latest version of the app.
self.addEventListener('activate', (event) => {
    // console.log('[Service Worker] Activate event triggered.');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// --- FETCHING PHASE ---
// Handles network requests, serving cached content first (cache-first strategy).
self.addEventListener('fetch', (event) => {
    // console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Not in cache - fetch from network
                return fetch(event.request);
            })
    );
});

