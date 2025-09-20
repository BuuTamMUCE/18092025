/**
 * Progressive Web App (PWA) Manager
 * Handles PWA features like offline support, push notifications, and app installation
 */

class PWAManager {
    constructor() {
        this.serviceWorker = null;
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        this.offlineData = new Map();
        
        this.init();
    }

    /**
     * Initialize PWA Manager
     */
    async init() {
        try {
            // Register service worker
            await this.registerServiceWorker();
            
            // Setup install prompt
            this.setupInstallPrompt();
            
            // Setup offline detection
            this.setupOfflineDetection();
            
            // Setup push notifications
            await this.setupPushNotifications();
            
            // Setup background sync
            this.setupBackgroundSync();
            
            console.log('✅ PWA Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize PWA Manager:', error);
        }
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                this.serviceWorker = registration;
                console.log('✅ Service Worker registered');
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Setup install prompt
     */
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            console.log('✅ PWA installed');
        });
    }

    /**
     * Show install button
     */
    showInstallButton() {
        const installButton = document.getElementById('install-pwa-btn');
        if (installButton) {
            installButton.classList.remove('hidden');
        }
    }

    /**
     * Hide install button
     */
    hideInstallButton() {
        const installButton = document.getElementById('install-pwa-btn');
        if (installButton) {
            installButton.classList.add('hidden');
        }
    }

    /**
     * Install PWA
     */
    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ PWA install accepted');
            } else {
                console.log('❌ PWA install dismissed');
            }
            
            this.deferredPrompt = null;
        }
    }

    /**
     * Setup offline detection
     */
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineStatus();
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineStatus();
        });
    }

    /**
     * Show online status
     */
    showOnlineStatus() {
        this.showNotification('You are back online!', 'success');
        this.updateConnectionStatus('online');
    }

    /**
     * Show offline status
     */
    showOfflineStatus() {
        this.showNotification('You are offline. Some features may be limited.', 'warning');
        this.updateConnectionStatus('offline');
    }

    /**
     * Update connection status in UI
     */
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.className = `px-3 py-1 rounded-full text-sm ${
                status === 'online' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
            }`;
            statusElement.innerHTML = `
                <span class="w-2 h-2 bg-${status === 'online' ? 'green' : 'yellow'}-500 rounded-full inline-block mr-2"></span>
                ${status === 'online' ? 'Online' : 'Offline'}
            `;
        }
    }

    /**
     * Setup push notifications
     */
    async setupPushNotifications() {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            // Request permission
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('✅ Push notifications enabled');
                this.subscribeToPushNotifications();
            } else {
                console.log('❌ Push notifications denied');
            }
        }
    }

    /**
     * Subscribe to push notifications
     */
    async subscribeToPushNotifications() {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });

            // Send subscription to server
            await this.sendSubscriptionToServer(subscription);
            console.log('✅ Push subscription created');
        } catch (error) {
            console.error('❌ Push subscription failed:', error);
        }
    }

    /**
     * Send subscription to server
     */
    async sendSubscriptionToServer(subscription) {
        try {
            await fetch('/api/push-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription)
            });
        } catch (error) {
            console.error('❌ Failed to send subscription to server:', error);
        }
    }

    /**
     * Show push notification
     */
    showPushNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/badge-72x72.png',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return notification;
        }
    }

    /**
     * Setup background sync
     */
    setupBackgroundSync() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            // Background sync is supported
            console.log('✅ Background sync supported');
        }
    }

    /**
     * Store data for offline use
     */
    storeOfflineData(key, data) {
        this.offlineData.set(key, {
            data: data,
            timestamp: Date.now()
        });
        
        // Store in IndexedDB for persistence
        this.storeInIndexedDB(key, data);
    }

    /**
     * Get offline data
     */
    getOfflineData(key) {
        return this.offlineData.get(key);
    }

    /**
     * Store in IndexedDB
     */
    async storeInIndexedDB(key, data) {
        try {
            const db = await this.openIndexedDB();
            const transaction = db.transaction(['offlineData'], 'readwrite');
            const store = transaction.objectStore('offlineData');
            await store.put({ key, data, timestamp: Date.now() });
        } catch (error) {
            console.error('❌ Failed to store in IndexedDB:', error);
        }
    }

    /**
     * Open IndexedDB
     */
    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('EduPlatformPWA', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('offlineData')) {
                    db.createObjectStore('offlineData', { keyPath: 'key' });
                }
            };
        });
    }

    /**
     * Sync offline data when online
     */
    async syncOfflineData() {
        if (this.isOnline) {
            for (const [key, value] of this.offlineData) {
                try {
                    await this.syncDataToServer(key, value.data);
                    this.offlineData.delete(key);
                } catch (error) {
                    console.error(`❌ Failed to sync data for key ${key}:`, error);
                }
            }
        }
    }

    /**
     * Sync data to server
     */
    async syncDataToServer(key, data) {
        // Implement your sync logic here
        console.log(`Syncing data for key ${key}:`, data);
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <div>
                    <p class="font-semibold">Update Available</p>
                    <p class="text-sm">A new version is available. Refresh to update.</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-auto">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Convert VAPID key
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    /**
     * Check if PWA is installed
     */
    isPWAInstalled() {
        return this.isInstalled || window.matchMedia('(display-mode: standalone)').matches;
    }

    /**
     * Get PWA capabilities
     */
    getPWACapabilities() {
        return {
            serviceWorker: 'serviceWorker' in navigator,
            pushNotifications: 'Notification' in window,
            backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
            installPrompt: 'beforeinstallprompt' in window,
            offlineStorage: 'indexedDB' in window,
            geolocation: 'geolocation' in navigator,
            camera: 'mediaDevices' in navigator,
            microphone: 'mediaDevices' in navigator
        };
    }
}

// Export for use in other modules
window.PWAManager = PWAManager;

