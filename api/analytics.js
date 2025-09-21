/**
 * Serverless Function - Analytics API
 * Collects and processes user analytics data
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, body, headers } = req;

  try {
    switch (method) {
      case 'POST':
        return await handleTrackEvent(req, res);
      case 'GET':
        return await handleGetAnalytics(req, res);
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Analytics API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleTrackEvent(req, res) {
  const {
    event,
    properties,
    userId,
    sessionId,
    timestamp,
    page,
    referrer,
    userAgent,
    ip
  } = req.body;

  // Validate required fields
  if (!event) {
    return res.status(400).json({ 
      error: 'Event name is required' 
    });
  }

  // Get additional data from headers
  const geo = {
    country: headers['x-vercel-ip-country'] || 'Unknown',
    region: headers['x-vercel-ip-region'] || 'Unknown',
    city: headers['x-vercel-ip-city'] || 'Unknown',
    timezone: headers['x-vercel-ip-timezone'] || 'UTC'
  };

  const device = {
    userAgent: userAgent || headers['user-agent'] || 'Unknown',
    platform: getUserPlatform(headers['user-agent']),
    browser: getBrowserInfo(headers['user-agent']),
    isMobile: /Mobile|Android|iPhone|iPad/i.test(headers['user-agent']),
    isTablet: /iPad|Android/i.test(headers['user-agent'])
  };

  // Create analytics event
  const analyticsEvent = {
    id: generateEventId(),
    event,
    properties: properties || {},
    userId: userId || 'anonymous',
    sessionId: sessionId || generateSessionId(),
    timestamp: timestamp || new Date().toISOString(),
    page: page || '/',
    referrer: referrer || headers.referer || 'direct',
    geo,
    device,
    serverTimestamp: new Date().toISOString(),
    version: '2.0.0'
  };

  // Process event based on type
  const processedEvent = await processEvent(analyticsEvent);

  // In real app, save to database/analytics service
  console.log('Analytics Event:', JSON.stringify(processedEvent, null, 2));

  // Return success response
  res.status(200).json({
    success: true,
    eventId: processedEvent.id,
    processedAt: processedEvent.serverTimestamp,
    message: 'Event tracked successfully'
  });
}

async function handleGetAnalytics(req, res) {
  const { 
    startDate, 
    endDate, 
    event, 
    userId, 
    groupBy = 'day',
    limit = 100 
  } = req.query;

  // Validate date range
  if (!startDate || !endDate) {
    return res.status(400).json({ 
      error: 'startDate and endDate are required' 
    });
  }

  // Mock analytics data (in real app, query database)
  const analytics = await getAnalyticsData({
    startDate,
    endDate,
    event,
    userId,
    groupBy,
    limit: parseInt(limit)
  });

  res.status(200).json({
    success: true,
    data: analytics,
    query: {
      startDate,
      endDate,
      event,
      userId,
      groupBy,
      limit
    },
    generatedAt: new Date().toISOString()
  });
}

async function processEvent(event) {
  // Add computed properties
  event.computed = {
    hour: new Date(event.timestamp).getHours(),
    dayOfWeek: new Date(event.timestamp).getDay(),
    isWeekend: [0, 6].includes(new Date(event.timestamp).getDay()),
    sessionDuration: calculateSessionDuration(event),
    bounceRate: calculateBounceRate(event),
    conversion: calculateConversion(event)
  };

  // Add user journey context
  event.journey = {
    step: getJourneyStep(event),
    funnel: getFunnelStage(event),
    cohort: getUserCohort(event.userId),
    retention: getUserRetention(event.userId)
  };

  return event;
}

async function getAnalyticsData({ startDate, endDate, event, userId, groupBy, limit }) {
  // Mock analytics data (in real app, query database)
  const mockData = {
    overview: {
      totalEvents: 15420,
      uniqueUsers: 3240,
      sessions: 4560,
      pageViews: 8920,
      bounceRate: 0.42,
      avgSessionDuration: 245, // seconds
      conversionRate: 0.08
    },
    events: [
      {
        name: 'page_view',
        count: 8920,
        uniqueUsers: 3240,
        avgPerUser: 2.75
      },
      {
        name: 'button_click',
        count: 3420,
        uniqueUsers: 1890,
        avgPerUser: 1.81
      },
      {
        name: 'form_submit',
        count: 890,
        uniqueUsers: 890,
        avgPerUser: 1.0
      },
      {
        name: 'video_play',
        count: 1560,
        uniqueUsers: 980,
        avgPerUser: 1.59
      },
      {
        name: 'quiz_complete',
        count: 720,
        uniqueUsers: 720,
        avgPerUser: 1.0
      }
    ],
    pages: [
      {
        path: '/',
        views: 3240,
        uniqueViews: 3240,
        avgTimeOnPage: 45,
        bounceRate: 0.38
      },
      {
        path: '/admin-dashboard.html',
        views: 1560,
        uniqueViews: 890,
        avgTimeOnPage: 320,
        bounceRate: 0.12
      },
      {
        path: '/student-dashboard.html',
        views: 2340,
        uniqueViews: 1450,
        avgTimeOnPage: 280,
        bounceRate: 0.18
      },
      {
        path: '/course-player.html',
        views: 1890,
        uniqueViews: 1200,
        avgTimeOnPage: 450,
        bounceRate: 0.08
      },
      {
        path: '/quiz-interface.html',
        views: 890,
        uniqueViews: 720,
        avgTimeOnPage: 180,
        bounceRate: 0.05
      }
    ],
    users: {
      newUsers: 890,
      returningUsers: 2350,
      activeUsers: 3240,
      churnedUsers: 120
    },
    geo: {
      countries: [
        { country: 'US', users: 1200, events: 4560 },
        { country: 'GB', users: 890, events: 3240 },
        { country: 'CA', users: 650, events: 2340 },
        { country: 'AU', users: 420, events: 1890 },
        { country: 'SG', users: 380, events: 1560 }
      ],
      cities: [
        { city: 'New York', users: 450, events: 1890 },
        { city: 'London', users: 380, events: 1560 },
        { city: 'Toronto', users: 320, events: 1340 },
        { city: 'Sydney', users: 280, events: 1200 },
        { city: 'Singapore', users: 260, events: 1100 }
      ]
    },
    devices: {
      desktop: { users: 1890, events: 6780 },
      mobile: { users: 980, events: 4560 },
      tablet: { users: 370, events: 1680 }
    },
    browsers: {
      chrome: { users: 1890, events: 6780 },
      safari: { users: 980, events: 4560 },
      firefox: { users: 280, events: 1200 },
      edge: { users: 90, events: 480 }
    }
  };

  return mockData;
}

// Helper functions
function generateEventId() {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function generateSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

function getUserPlatform(userAgent) {
  if (/Windows/i.test(userAgent)) return 'Windows';
  if (/Mac/i.test(userAgent)) return 'macOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/iPhone|iPad/i.test(userAgent)) return 'iOS';
  return 'Unknown';
}

function getBrowserInfo(userAgent) {
  if (/Chrome/i.test(userAgent)) return 'Chrome';
  if (/Firefox/i.test(userAgent)) return 'Firefox';
  if (/Safari/i.test(userAgent)) return 'Safari';
  if (/Edge/i.test(userAgent)) return 'Edge';
  if (/Opera/i.test(userAgent)) return 'Opera';
  return 'Unknown';
}

function calculateSessionDuration(event) {
  // Mock calculation (in real app, calculate from session data)
  return Math.floor(Math.random() * 600) + 60; // 1-10 minutes
}

function calculateBounceRate(event) {
  // Mock calculation
  return Math.random() * 0.6; // 0-60% bounce rate
}

function calculateConversion(event) {
  // Mock calculation
  return Math.random() < 0.1; // 10% conversion rate
}

function getJourneyStep(event) {
  const journeyMap = {
    'page_view': 'discovery',
    'button_click': 'engagement',
    'form_submit': 'conversion',
    'video_play': 'learning',
    'quiz_complete': 'assessment'
  };
  return journeyMap[event.event] || 'unknown';
}

function getFunnelStage(event) {
  const funnelMap = {
    '/': 'awareness',
    '/admin-login.html': 'consideration',
    '/student-login.html': 'consideration',
    '/admin-dashboard.html': 'conversion',
    '/student-dashboard.html': 'conversion',
    '/course-player.html': 'retention',
    '/quiz-interface.html': 'engagement'
  };
  return funnelMap[event.page] || 'unknown';
}

function getUserCohort(userId) {
  // Mock cohort assignment
  const cohorts = ['early_adopter', 'power_user', 'casual_user', 'new_user'];
  return cohorts[Math.floor(Math.random() * cohorts.length)];
}

function getUserRetention(userId) {
  // Mock retention calculation
  return {
    day1: Math.random() > 0.3,
    day7: Math.random() > 0.6,
    day30: Math.random() > 0.8
  };
}
