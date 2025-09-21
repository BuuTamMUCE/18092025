/**
 * Edge Function - Geographic Routing and Personalization
 * Runs at the edge for ultra-fast response times
 */

export const config = {
  runtime: 'edge',
  regions: ['sin1', 'hkg1', 'nrt1', 'iad1', 'lhr1']
};

export default async function handler(request) {
  const { nextUrl, geo, headers } = request;
  
  // Get user location and device info
  const country = geo?.country || 'US';
  const region = geo?.region || 'CA';
  const city = geo?.city || 'San Francisco';
  const timezone = geo?.timezone || 'America/Los_Angeles';
  const userAgent = headers.get('user-agent') || '';
  const acceptLanguage = headers.get('accept-language') || 'en';
  
  // Determine optimal settings based on location
  const settings = {
    country,
    region,
    city,
    timezone,
    language: acceptLanguage.split(',')[0] || 'en',
    currency: getCurrency(country),
    dateFormat: getDateFormat(country),
    serverRegion: getServerRegion(region),
    features: getRegionalFeatures(country),
    performance: getPerformanceSettings(country, userAgent)
  };

  // Add headers for client-side personalization
  const response = new Response(JSON.stringify(settings), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-User-Country': country,
      'X-User-Region': region,
      'X-User-City': city,
      'X-User-Timezone': timezone,
      'X-Optimal-Server': settings.serverRegion,
      'X-Features': JSON.stringify(settings.features),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });

  return response;
}

function getCurrency(country) {
  const currencyMap = {
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    'JP': 'JPY',
    'KR': 'KRW',
    'CN': 'CNY',
    'IN': 'INR',
    'AU': 'AUD',
    'CA': 'CAD',
    'SG': 'SGD',
    'TH': 'THB',
    'VN': 'VND',
    'MY': 'MYR',
    'ID': 'IDR',
    'PH': 'PHP'
  };
  return currencyMap[country] || 'USD';
}

function getDateFormat(country) {
  const dateFormatMap = {
    'US': 'MM/DD/YYYY',
    'GB': 'DD/MM/YYYY',
    'EU': 'DD.MM.YYYY',
    'JP': 'YYYY/MM/DD',
    'CN': 'YYYY-MM-DD'
  };
  return dateFormatMap[country] || 'MM/DD/YYYY';
}

function getServerRegion(region) {
  const regionMap = {
    'CA': 'iad1', // North America
    'NY': 'iad1',
    'TX': 'iad1',
    'WA': 'iad1',
    'GB': 'lhr1', // Europe
    'FR': 'lhr1',
    'DE': 'lhr1',
    'JP': 'nrt1', // Asia Pacific
    'KR': 'nrt1',
    'CN': 'nrt1',
    'SG': 'sin1',
    'HK': 'hkg1',
    'TH': 'sin1',
    'VN': 'sin1',
    'MY': 'sin1',
    'ID': 'sin1',
    'PH': 'sin1'
  };
  return regionMap[region] || 'iad1';
}

function getRegionalFeatures(country) {
  const features = {
    // Base features for all regions
    aiChatbot: true,
    liveStreaming: true,
    vrLearning: true,
    analytics: true,
    certificates: true,
    
    // Regional specific features
    paymentMethods: getPaymentMethods(country),
    languages: getSupportedLanguages(country),
    compliance: getComplianceFeatures(country),
    integrations: getRegionalIntegrations(country)
  };
  
  return features;
}

function getPaymentMethods(country) {
  const paymentMap = {
    'US': ['stripe', 'paypal', 'apple_pay', 'google_pay'],
    'GB': ['stripe', 'paypal', 'apple_pay', 'google_pay'],
    'EU': ['stripe', 'paypal', 'sepa', 'apple_pay', 'google_pay'],
    'JP': ['stripe', 'paypal', 'konbini'],
    'KR': ['stripe', 'paypal', 'kakaopay', 'toss'],
    'CN': ['alipay', 'wechat_pay', 'unionpay'],
    'SG': ['stripe', 'paypal', 'grabpay'],
    'TH': ['stripe', 'paypal', 'promptpay'],
    'VN': ['stripe', 'paypal', 'vnpay', 'momo'],
    'MY': ['stripe', 'paypal', 'fpx', 'boost'],
    'ID': ['stripe', 'paypal', 'ovo', 'dana'],
    'PH': ['stripe', 'paypal', 'gcash', 'paymaya']
  };
  return paymentMap[country] || ['stripe', 'paypal'];
}

function getSupportedLanguages(country) {
  const languageMap = {
    'US': ['en', 'es'],
    'GB': ['en'],
    'EU': ['en', 'fr', 'de', 'es', 'it'],
    'JP': ['ja', 'en'],
    'KR': ['ko', 'en'],
    'CN': ['zh', 'en'],
    'SG': ['en', 'zh', 'ms', 'ta'],
    'TH': ['th', 'en'],
    'VN': ['vi', 'en'],
    'MY': ['ms', 'en', 'zh', 'ta'],
    'ID': ['id', 'en'],
    'PH': ['en', 'fil']
  };
  return languageMap[country] || ['en'];
}

function getComplianceFeatures(country) {
  const complianceMap = {
    'US': ['ferpa', 'coppa', 'ccpa'],
    'GB': ['gdpr', 'dpa2018'],
    'EU': ['gdpr'],
    'JP': ['appi'],
    'KR': ['pipeda'],
    'SG': ['pdpa'],
    'AU': ['privacy_act'],
    'CA': ['pipeda']
  };
  return complianceMap[country] || [];
}

function getRegionalIntegrations(country) {
  const integrationMap = {
    'US': ['zoom', 'teams', 'slack', 'google_workspace'],
    'GB': ['teams', 'slack', 'zoom', 'google_workspace'],
    'EU': ['teams', 'slack', 'zoom', 'google_workspace'],
    'JP': ['zoom', 'teams', 'line'],
    'KR': ['zoom', 'teams', 'kakaotalk'],
    'CN': ['zoom', 'teams', 'wechat', 'dingtalk'],
    'SG': ['zoom', 'teams', 'slack', 'google_workspace'],
    'TH': ['zoom', 'teams', 'line'],
    'VN': ['zoom', 'teams', 'zalo'],
    'MY': ['zoom', 'teams', 'slack', 'google_workspace'],
    'ID': ['zoom', 'teams', 'whatsapp'],
    'PH': ['zoom', 'teams', 'slack', 'google_workspace']
  };
  return integrationMap[country] || ['zoom', 'teams', 'slack'];
}

function getPerformanceSettings(country, userAgent) {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  const isSlowConnection = headers.get('save-data') === 'on';
  
  return {
    imageQuality: isSlowConnection ? 'low' : 'high',
    videoQuality: isSlowConnection ? '480p' : '1080p',
    preloadResources: !isSlowConnection,
    enableAnimations: !isSlowConnection,
    enableWebP: true,
    enableLazyLoading: true,
    compressionLevel: isSlowConnection ? 'high' : 'medium',
    cacheStrategy: isMobile ? 'aggressive' : 'standard'
  };
}
