/**
 * Edge Function - A/B Testing and Feature Flags
 * Ultra-fast feature flag evaluation at the edge
 */

export const config = {
  runtime: 'edge',
  regions: ['sin1', 'hkg1', 'nrt1', 'iad1', 'lhr1']
};

export default async function handler(request) {
  const { nextUrl, headers, geo } = request;
  const userId = headers.get('x-user-id') || generateUserId();
  const userAgent = headers.get('user-agent') || '';
  const country = geo?.country || 'US';
  
  // Parse query parameters
  const url = new URL(nextUrl);
  const testName = url.searchParams.get('test') || 'default';
  const variant = url.searchParams.get('variant') || null;
  
  // Feature flags configuration
  const featureFlags = {
    newDashboard: {
      enabled: true,
      rollout: 0.5, // 50% of users
      countries: ['US', 'GB', 'CA', 'AU', 'SG', 'HK'],
      userGroups: ['premium', 'beta'],
      variants: ['control', 'variant_a', 'variant_b']
    },
    aiChatbot: {
      enabled: true,
      rollout: 0.8, // 80% of users
      countries: ['all'],
      userGroups: ['all'],
      variants: ['enabled', 'disabled']
    },
    darkMode: {
      enabled: true,
      rollout: 1.0, // 100% of users
      countries: ['all'],
      userGroups: ['all'],
      variants: ['auto', 'light', 'dark']
    },
    vrLearning: {
      enabled: true,
      rollout: 0.3, // 30% of users
      countries: ['US', 'GB', 'JP', 'KR', 'SG'],
      userGroups: ['premium', 'enterprise'],
      variants: ['enabled', 'disabled']
    },
    liveStreaming: {
      enabled: true,
      rollout: 0.7, // 70% of users
      countries: ['all'],
      userGroups: ['all'],
      variants: ['enabled', 'disabled']
    },
    analytics: {
      enabled: true,
      rollout: 1.0, // 100% of users
      countries: ['all'],
      userGroups: ['all'],
      variants: ['full', 'basic', 'disabled']
    }
  };
  
  // Get user segment
  const userSegment = getUserSegment(userId, country, userAgent);
  
  // Evaluate feature flags
  const flags = {};
  for (const [flagName, config] of Object.entries(featureFlags)) {
    flags[flagName] = evaluateFeatureFlag(flagName, config, userId, userSegment, variant);
  }
  
  // Get A/B test results
  const abTests = getABTestResults(testName, userId, userSegment);
  
  // Performance optimizations
  const optimizations = {
    preload: flags.newDashboard ? ['dashboard.js', 'analytics.js'] : ['legacy.js'],
    criticalCSS: flags.darkMode ? ['dark-theme.css'] : ['light-theme.css'],
    lazyLoad: flags.vrLearning ? ['vr-components.js'] : [],
    cdn: getOptimalCDN(country),
    compression: getCompressionLevel(userAgent)
  };
  
  const response = {
    userId,
    userSegment,
    flags,
    abTests,
    optimizations,
    timestamp: Date.now(),
    version: '2.0.0'
  };
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      'X-Feature-Flags': JSON.stringify(flags),
      'X-User-Segment': userSegment,
      'X-AB-Tests': JSON.stringify(abTests),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-ID'
    }
  });
}

function generateUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

function getUserSegment(userId, country, userAgent) {
  const segments = {
    device: /Mobile|Android|iPhone|iPad/i.test(userAgent) ? 'mobile' : 'desktop',
    region: getRegionSegment(country),
    tier: getTierSegment(userId),
    behavior: getBehaviorSegment(userId)
  };
  
  return {
    primary: segments.device + '_' + segments.region + '_' + segments.tier,
    device: segments.device,
    region: segments.region,
    tier: segments.tier,
    behavior: segments.behavior
  };
}

function getRegionSegment(country) {
  const regions = {
    'US': 'north_america',
    'CA': 'north_america',
    'GB': 'europe',
    'FR': 'europe',
    'DE': 'europe',
    'JP': 'asia_pacific',
    'KR': 'asia_pacific',
    'CN': 'asia_pacific',
    'SG': 'asia_pacific',
    'HK': 'asia_pacific',
    'TH': 'asia_pacific',
    'VN': 'asia_pacific',
    'MY': 'asia_pacific',
    'ID': 'asia_pacific',
    'PH': 'asia_pacific',
    'AU': 'oceania',
    'NZ': 'oceania'
  };
  return regions[country] || 'global';
}

function getTierSegment(userId) {
  // Simulate user tier based on user ID hash
  const hash = simpleHash(userId);
  if (hash % 100 < 5) return 'enterprise';
  if (hash % 100 < 20) return 'premium';
  if (hash % 100 < 50) return 'standard';
  return 'basic';
}

function getBehaviorSegment(userId) {
  const hash = simpleHash(userId);
  const behaviors = ['early_adopter', 'power_user', 'casual_user', 'new_user'];
  return behaviors[hash % behaviors.length];
}

function evaluateFeatureFlag(flagName, config, userId, userSegment, forcedVariant) {
  // Check if feature is globally enabled
  if (!config.enabled) {
    return { enabled: false, variant: 'disabled', reason: 'globally_disabled' };
  }
  
  // Check country restrictions
  if (config.countries && config.countries !== ['all'] && !config.countries.includes(userSegment.region)) {
    return { enabled: false, variant: 'disabled', reason: 'country_restricted' };
  }
  
  // Check user group restrictions
  if (config.userGroups && config.userGroups !== ['all'] && !config.userGroups.includes(userSegment.tier)) {
    return { enabled: false, variant: 'disabled', reason: 'tier_restricted' };
  }
  
  // Forced variant (for testing)
  if (forcedVariant && config.variants.includes(forcedVariant)) {
    return { enabled: true, variant: forcedVariant, reason: 'forced' };
  }
  
  // Rollout percentage check
  const userHash = simpleHash(userId + flagName);
  const rolloutThreshold = config.rollout * 100;
  
  if (userHash % 100 >= rolloutThreshold) {
    return { enabled: false, variant: 'disabled', reason: 'rollout_excluded' };
  }
  
  // Select variant based on user hash
  const variantIndex = userHash % config.variants.length;
  const selectedVariant = config.variants[variantIndex];
  
  return {
    enabled: selectedVariant !== 'disabled',
    variant: selectedVariant,
    reason: 'rollout_included',
    rollout: config.rollout,
    segment: userSegment.primary
  };
}

function getABTestResults(testName, userId, userSegment) {
  const tests = {
    homepage_layout: {
      variants: ['control', 'variant_a', 'variant_b'],
      weights: [0.33, 0.33, 0.34]
    },
    pricing_display: {
      variants: ['monthly', 'annual', 'lifetime'],
      weights: [0.4, 0.4, 0.2]
    },
    cta_button: {
      variants: ['blue', 'green', 'purple'],
      weights: [0.33, 0.33, 0.34]
    }
  };
  
  const test = tests[testName];
  if (!test) {
    return { test: testName, variant: 'control', reason: 'test_not_found' };
  }
  
  const userHash = simpleHash(userId + testName);
  let cumulativeWeight = 0;
  const randomValue = userHash % 100;
  
  for (let i = 0; i < test.variants.length; i++) {
    cumulativeWeight += test.weights[i] * 100;
    if (randomValue < cumulativeWeight) {
      return {
        test: testName,
        variant: test.variants[i],
        weight: test.weights[i],
        segment: userSegment.primary
      };
    }
  }
  
  return { test: testName, variant: 'control', reason: 'fallback' };
}

function getOptimalCDN(country) {
  const cdnMap = {
    'US': 'us-east-1',
    'CA': 'us-east-1',
    'GB': 'eu-west-2',
    'FR': 'eu-west-3',
    'DE': 'eu-central-1',
    'JP': 'ap-northeast-1',
    'KR': 'ap-northeast-2',
    'CN': 'ap-east-1',
    'SG': 'ap-southeast-1',
    'HK': 'ap-east-1',
    'TH': 'ap-southeast-1',
    'VN': 'ap-southeast-1',
    'MY': 'ap-southeast-1',
    'ID': 'ap-southeast-1',
    'PH': 'ap-southeast-1',
    'AU': 'ap-southeast-2',
    'NZ': 'ap-southeast-2'
  };
  return cdnMap[country] || 'us-east-1';
}

function getCompressionLevel(userAgent) {
  const isOldBrowser = /MSIE|Trident|Opera Mini/i.test(userAgent);
  return isOldBrowser ? 'gzip' : 'brotli';
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
