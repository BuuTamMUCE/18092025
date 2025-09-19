/**
 * Configuration file for EduPlatform
 * Contains API keys and configuration settings
 */

const CONFIG = {
    // Gemini AI API Key
    GEMINI_API_KEY: 'AIzaSyB_Wjc9R8wiuV_AOdxj689QG84CTVNeos4',
    
    // API Endpoints
    API_ENDPOINTS: {
        GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        GEMINI_EMBEDDING_URL: 'https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent'
    },
    
    // AI Settings
    AI_SETTINGS: {
        MAX_TOKENS: 1024,
        TEMPERATURE: 0.7,
        TOP_K: 40,
        TOP_P: 0.95,
        MAX_HISTORY_LENGTH: 10,
        RESPONSE_TIMEOUT: 30000 // 30 seconds
    },
    
    // Feature Flags
    FEATURES: {
        AI_CHATBOT: true,
        AI_RECOMMENDATIONS: true,
        AI_QUIZ_GENERATOR: true,
        AI_STUDY_TIPS: true,
        AI_CONTENT_SUMMARY: true,
        AI_TRANSLATION: true,
        AI_ANALYTICS: true
    },
    
    // UI Settings
    UI: {
        THEME: 'auto', // 'light', 'dark', 'auto'
        ANIMATIONS: true,
        SOUNDS: false,
        NOTIFICATIONS: true
    },
    
    // Security Settings
    SECURITY: {
        ENABLE_CORS: true,
        RATE_LIMITING: true,
        CONTENT_FILTERING: true
    },
    
    // Development Settings
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_API_CALLS: false
    }
};

// Export configuration
window.CONFIG = CONFIG;

// Helper functions
const ConfigHelper = {
    /**
     * Get API key
     */
    getApiKey: function() {
        return CONFIG.GEMINI_API_KEY;
    },
    
    /**
     * Get AI settings
     */
    getAISettings: function() {
        return CONFIG.AI_SETTINGS;
    },
    
    /**
     * Check if feature is enabled
     */
    isFeatureEnabled: function(feature) {
        return CONFIG.FEATURES[feature] || false;
    },
    
    /**
     * Get API endpoint
     */
    getApiEndpoint: function(endpoint) {
        return CONFIG.API_ENDPOINTS[endpoint];
    },
    
    /**
     * Update configuration
     */
    updateConfig: function(key, value) {
        const keys = key.split('.');
        let current = CONFIG;
        
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    },
    
    /**
     * Get configuration value
     */
    getConfig: function(key) {
        const keys = key.split('.');
        let current = CONFIG;
        
        for (const k of keys) {
            current = current[k];
            if (current === undefined) {
                return undefined;
            }
        }
        
        return current;
    }
};

// Export helper
window.ConfigHelper = ConfigHelper;

