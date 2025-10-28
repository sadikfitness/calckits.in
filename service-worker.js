/* ========================================
   CalcKit - Service Worker
   Offline Support & Caching
   ======================================== */

const CACHE_NAME = 'calckit-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/calculators.js',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];

// Install Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch Strategy: Network First, falling back to Cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Check if valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        // Return offline page or default response
                        return new Response('Offline - CalcKit requires internet connection for first load.', {
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Background Sync for future features
self.addEventListener('sync', event => {
    if (event.tag === 'sync-calculations') {
        event.waitUntil(syncCalculations());
    }
});

async function syncCalculations() {
    // Placeholder for syncing calculation history
    console.log('Syncing calculations...');
}

// Push Notifications (for future features)
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'CalcKit Notification';
    const options = {
        body: data.body || 'New update available!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        data: data.url
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/')
    );
});

