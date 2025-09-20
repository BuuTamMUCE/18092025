/**
 * Service Worker for EduPlatform PWA
 * Handles caching, offline functionality, and background sync
 */

const CACHE_NAME = 'eduplatform-v1.0.0';
const STATIC_CACHE = 'eduplatform-static-v1.0.0';
const DYNAMIC_CACHE = 'eduplatform-dynamic-v1.0.0';

// Files to cache for offline use
const STATIC_FILES = [
    '/',
    '/index.html',
    '/ai-dashboard.html',
    '/live-classroom.html',
    '/js/config.js',
    '/js/gemini-ai.js',
    '/js/ai-chatbot.js',
    '/js/webrtc-manager.js',
    '/js/pwa-manager.js',
    '/css/styles.css',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
    /^\/api\/courses/,
    /^\/api\/quizzes/,
    /^\/api\/users/,
    /^\/api\/progress/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        handleRequest(request)
    );
});

// Handle different types of requests
async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Static files - cache first
        if (isStaticFile(url)) {
            return await cacheFirst(request, STATIC_CACHE);
        }
        
        // API requests - network first with cache fallback
        if (isAPIRequest(url)) {
            return await networkFirst(request, DYNAMIC_CACHE);
        }
        
        // Images and media - cache first
        if (isMediaFile(url)) {
            return await cacheFirst(request, DYNAMIC_CACHE);
        }
        
        // Other requests - network first
        return await networkFirst(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('Fetch error:', error);
        
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return await caches.match('/offline.html');
        }
        
        // Return cached version if available
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return error response
        return new Response('Network error', {
            status: 408,
            statusText: 'Request Timeout'
        });
    }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Check if request is for static file
function isStaticFile(url) {
    return STATIC_FILES.some(file => url.pathname === file) ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.html');
}

// Check if request is for API
function isAPIRequest(url) {
    return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is for media file
function isMediaFile(url) {
    return url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|mp4|mp3|wav|ogg)$/i);
}

// Background sync event
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-offline-data') {
        event.waitUntil(syncOfflineData());
    }
});

// Sync offline data
async function syncOfflineData() {
    try {
        // Get offline data from IndexedDB
        const offlineData = await getOfflineDataFromIndexedDB();
        
        for (const data of offlineData) {
            try {
                await syncDataToServer(data);
                await removeOfflineData(data.key);
            } catch (error) {
                console.error('Failed to sync data:', error);
            }
        }
        
        console.log('Offline data synced successfully');
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Get offline data from IndexedDB
async function getOfflineDataFromIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('EduPlatformPWA', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['offlineData'], 'readonly');
            const store = transaction.objectStore('offlineData');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => resolve(getAllRequest.result);
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
    });
}

// Sync data to server
async function syncDataToServer(data) {
    const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Sync failed');
    }
    
    return response;
}

// Remove offline data
async function removeOfflineData(key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('EduPlatformPWA', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['offlineData'], 'readwrite');
            const store = transaction.objectStore('offlineData');
            const deleteRequest = store.delete(key);
            
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
    });
}

// Push event - handle push notifications
self.addEventListener('push', (event) => {
    console.log('Push event received:', event);
    
    const options = {
        body: 'You have a new notification from EduPlatform',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.title = data.title || 'EduPlatform';
    }
    
    event.waitUntil(
        self.registration.showNotification('EduPlatform', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('Message received in service worker:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

