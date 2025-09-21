/**
 * Vercel Analytics and Speed Insights Integration
 * Optimized for EduPlatform LMS
 */

class VercelAnalytics {
    constructor() {
        this.isInitialized = false;
        this.config = {
            analytics: {
                enabled: true,
                debug: false,
                trackPageViews: true,
                trackUserInteractions: true,
                trackPerformance: true
            },
            speedInsights: {
                enabled: true,
                sampleRate: 0.1, // 10% of users
                trackWebVitals: true,
                trackCLS: true,
                trackFID: true,
                trackLCP: true,
                trackTTFB: true
            }
        };
        
        this.events = [];
        this.performanceMetrics = {};
        this.userSession = this.generateSessionId();
        
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            // Initialize analytics
            await this.initializeAnalytics();
            
            // Initialize speed insights
            await this.initializeSpeedInsights();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Track page load
            this.trackPageLoad();
            
            this.isInitialized = true;
            
            if (this.config.analytics.debug) {
                console.log('Vercel Analytics initialized successfully');
            }
        } catch (error) {
            console.error('Failed to initialize Vercel Analytics:', error);
        }
    }

    async initializeAnalytics() {
        // Load Vercel Analytics script
        if (typeof window !== 'undefined' && this.config.analytics.enabled) {
            const script = document.createElement('script');
            script.src = 'https://vercel.live/analytics.js';
            script.defer = true;
            script.onload = () => {
                if (window.va) {
                    window.va('init', {
                        endpoint: '/api/analytics',
                        debug: this.config.analytics.debug
                    });
                }
            };
            document.head.appendChild(script);
        }
    }

    async initializeSpeedInsights() {
        // Load Vercel Speed Insights script
        if (typeof window !== 'undefined' && this.config.speedInsights.enabled) {
            const script = document.createElement('script');
            script.src = 'https://vercel.live/speed-insights.js';
            script.defer = true;
            script.onload = () => {
                if (window.va) {
                    window.va('init', {
                        endpoint: '/api/speed-insights',
                        sampleRate: this.config.speedInsights.sampleRate
                    });
                }
            };
            document.head.appendChild(script);
        }
    }

    setupEventListeners() {
        // Track user interactions
        if (this.config.analytics.trackUserInteractions) {
            this.trackUserInteractions();
        }

        // Track performance metrics
        if (this.config.speedInsights.trackWebVitals) {
            this.trackWebVitals();
        }

        // Track page visibility changes
        this.trackVisibilityChanges();

        // Track errors
        this.trackErrors();

        // Track navigation
        this.trackNavigation();
    }

    trackPageLoad() {
        const pageData = {
            url: window.location.href,
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            timestamp: Date.now(),
            sessionId: this.userSession
        };

        this.track('page_view', pageData);
    }

    trackUserInteractions() {
        // Track clicks
        document.addEventListener('click', (event) => {
            const element = event.target;
            const data = {
                element: this.getElementInfo(element),
                position: {
                    x: event.clientX,
                    y: event.clientY
                },
                timestamp: Date.now()
            };

            this.track('click', data);
        });

        // Track form submissions
        document.addEventListener('submit', (event) => {
            const form = event.target;
            const data = {
                form: {
                    id: form.id,
                    name: form.name,
                    action: form.action,
                    method: form.method
                },
                timestamp: Date.now()
            };

            this.track('form_submit', data);
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', this.throttle(() => {
            const scrollDepth = Math.round(
                (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                this.track('scroll_depth', {
                    depth: scrollDepth,
                    timestamp: Date.now()
                });
            }
        }, 1000));

        // Track time on page
        this.trackTimeOnPage();
    }

    trackWebVitals() {
        // Track Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.track('lcp', {
                    value: lastEntry.startTime,
                    element: lastEntry.element?.tagName || 'unknown',
                    timestamp: Date.now()
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.track('fid', {
                        value: entry.processingStart - entry.startTime,
                        timestamp: Date.now()
                    });
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.track('cls', {
                    value: clsValue,
                    timestamp: Date.now()
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // Time to First Byte (TTFB)
            const ttfbObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.responseStart > 0) {
                        this.track('ttfb', {
                            value: entry.responseStart - entry.fetchStart,
                            timestamp: Date.now()
                        });
                    }
                });
            });
            ttfbObserver.observe({ entryTypes: ['navigation'] });
        }

        // Track page load performance
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.track('page_performance', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                    timestamp: Date.now()
                });
            }
        });
    }

    trackVisibilityChanges() {
        document.addEventListener('visibilitychange', () => {
            this.track('visibility_change', {
                visible: !document.hidden,
                timestamp: Date.now()
            });
        });
    }

    trackErrors() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.track('javascript_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now()
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.track('promise_rejection', {
                reason: event.reason?.toString() || 'Unknown',
                timestamp: Date.now()
            });
        });
    }

    trackNavigation() {
        // Track navigation changes (for SPA)
        let currentPath = window.location.pathname;
        
        const checkPathChange = () => {
            if (window.location.pathname !== currentPath) {
                this.track('navigation', {
                    from: currentPath,
                    to: window.location.pathname,
                    timestamp: Date.now()
                });
                currentPath = window.location.pathname;
            }
        };

        // Check for path changes periodically
        setInterval(checkPathChange, 1000);

        // Override pushState and replaceState for SPA navigation
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            checkPathChange();
        };

        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args);
            checkPathChange();
        };
    }

    trackTimeOnPage() {
        const startTime = Date.now();
        
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - startTime;
            this.track('time_on_page', {
                duration: timeOnPage,
                timestamp: Date.now()
            });
        });
    }

    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data: {
                ...data,
                url: window.location.href,
                path: window.location.pathname,
                timestamp: data.timestamp || Date.now(),
                sessionId: this.userSession,
                userId: this.getUserId()
            }
        };

        this.events.push(event);

        // Send to Vercel Analytics
        if (window.va && this.config.analytics.enabled) {
            window.va('track', eventName, event.data);
        }

        // Send to custom analytics endpoint
        this.sendToAnalytics(event);

        if (this.config.analytics.debug) {
            console.log('Analytics Event:', event);
        }
    }

    async sendToAnalytics(event) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            });
        } catch (error) {
            console.error('Failed to send analytics event:', error);
        }
    }

    getElementInfo(element) {
        return {
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            text: element.textContent?.substring(0, 100),
            href: element.href,
            type: element.type
        };
    }

    getUserId() {
        // Get user ID from localStorage or generate one
        let userId = localStorage.getItem('vercel_analytics_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('vercel_analytics_user_id', userId);
        }
        return userId;
    }

    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // Public methods for custom tracking
    trackCustomEvent(eventName, properties = {}) {
        this.track(eventName, properties);
    }

    trackConversion(conversionType, value = null) {
        this.track('conversion', {
            type: conversionType,
            value,
            timestamp: Date.now()
        });
    }

    trackUserEngagement(action, target, duration = null) {
        this.track('user_engagement', {
            action,
            target,
            duration,
            timestamp: Date.now()
        });
    }

    trackPerformanceMetric(metric, value, context = {}) {
        this.track('performance_metric', {
            metric,
            value,
            context,
            timestamp: Date.now()
        });
    }

    // Configuration methods
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    enableDebug() {
        this.config.analytics.debug = true;
    }

    disableDebug() {
        this.config.analytics.debug = false;
    }
}

// Initialize analytics when DOM is loaded
let vercelAnalytics;

document.addEventListener('DOMContentLoaded', () => {
    vercelAnalytics = new VercelAnalytics();
    
    // Make available globally
    window.vercelAnalytics = vercelAnalytics;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VercelAnalytics;
}
