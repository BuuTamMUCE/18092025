/**
 * Serverless Function - AI Chatbot API
 * Integrates with AI services for intelligent conversations
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
        return await handleChatMessage(req, res);
      case 'GET':
        return await handleGetChatHistory(req, res);
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('AI Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleChatMessage(req, res) {
  const {
    message,
    userId,
    sessionId,
    context,
    messageType = 'text',
    language = 'en'
  } = req.body;

  // Validate input
  if (!message || !userId) {
    return res.status(400).json({ 
      error: 'Message and userId are required' 
    });
  }

  // Get user context
  const userContext = await getUserContext(userId);
  
  // Process message based on type
  let response;
  switch (messageType) {
    case 'text':
      response = await processTextMessage(message, userContext, context);
      break;
    case 'voice':
      response = await processVoiceMessage(message, userContext, context);
      break;
    case 'image':
      response = await processImageMessage(message, userContext, context);
      break;
    default:
      response = await processTextMessage(message, userContext, context);
  }

  // Save conversation to history
  await saveConversation({
    userId,
    sessionId,
    userMessage: message,
    aiResponse: response,
    timestamp: new Date().toISOString(),
    context,
    language
  });

  // Track analytics
  await trackChatEvent({
    userId,
    sessionId,
    event: 'chat_message',
    properties: {
      messageType,
      language,
      responseTime: response.responseTime,
      context
    }
  });

  res.status(200).json({
    success: true,
    response,
    sessionId,
    timestamp: new Date().toISOString()
  });
}

async function handleGetChatHistory(req, res) {
  const { userId, sessionId, limit = 50 } = req.query;

  if (!userId) {
    return res.status(400).json({ 
      error: 'userId is required' 
    });
  }

  // Get chat history (mock data)
  const history = await getChatHistory(userId, sessionId, parseInt(limit));

  res.status(200).json({
    success: true,
    history,
    userId,
    sessionId,
    count: history.length
  });
}

async function processTextMessage(message, userContext, context) {
  const startTime = Date.now();
  
  // Analyze message intent
  const intent = await analyzeIntent(message);
  
  // Generate response based on intent
  let response;
  switch (intent.type) {
    case 'greeting':
      response = generateGreetingResponse(userContext);
      break;
    case 'question':
      response = await generateQuestionResponse(message, userContext, context);
      break;
    case 'help':
      response = generateHelpResponse(userContext);
      break;
    case 'course_inquiry':
      response = await generateCourseResponse(message, userContext);
      break;
    case 'technical_support':
      response = await generateTechnicalResponse(message, userContext);
      break;
    case 'feedback':
      response = generateFeedbackResponse(message, userContext);
      break;
    default:
      response = generateDefaultResponse(message, userContext);
  }

  const responseTime = Date.now() - startTime;

  return {
    ...response,
    intent,
    responseTime,
    suggestions: generateSuggestions(intent, userContext),
    confidence: intent.confidence
  };
}

async function processVoiceMessage(message, userContext, context) {
  // Mock voice processing (in real app, integrate with speech-to-text)
  const transcribedText = message; // Assume already transcribed
  
  const textResponse = await processTextMessage(transcribedText, userContext, context);
  
  return {
    ...textResponse,
    audioUrl: generateAudioResponse(textResponse.text),
    transcribedText
  };
}

async function processImageMessage(message, userContext, context) {
  // Mock image processing (in real app, integrate with vision AI)
  const imageAnalysis = {
    objects: ['person', 'book', 'computer'],
    text: ['EduPlatform', 'Learning Management System'],
    context: 'educational environment'
  };

  const response = await processTextMessage(
    `I can see: ${imageAnalysis.objects.join(', ')}. ${imageAnalysis.text.join(', ')}. Context: ${imageAnalysis.context}`,
    userContext,
    context
  );

  return {
    ...response,
    imageAnalysis,
    type: 'image_response'
  };
}

async function analyzeIntent(message) {
  // Mock intent analysis (in real app, use NLP service)
  const message_lower = message.toLowerCase();
  
  const intents = [
    {
      type: 'greeting',
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      confidence: 0.9
    },
    {
      type: 'question',
      patterns: ['what', 'how', 'when', 'where', 'why', 'can you', 'could you'],
      confidence: 0.8
    },
    {
      type: 'help',
      patterns: ['help', 'assist', 'support', 'guide', 'how to'],
      confidence: 0.85
    },
    {
      type: 'course_inquiry',
      patterns: ['course', 'class', 'lesson', 'learn', 'education', 'study'],
      confidence: 0.8
    },
    {
      type: 'technical_support',
      patterns: ['error', 'problem', 'bug', 'issue', 'not working', 'broken'],
      confidence: 0.85
    },
    {
      type: 'feedback',
      patterns: ['feedback', 'suggestion', 'improve', 'better', 'rating'],
      confidence: 0.8
    }
  ];

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      if (message_lower.includes(pattern)) {
        return {
          type: intent.type,
          confidence: intent.confidence,
          matchedPattern: pattern
        };
      }
    }
  }

  return {
    type: 'unknown',
    confidence: 0.3,
    matchedPattern: null
  };
}

function generateGreetingResponse(userContext) {
  const greetings = [
    `Hello ${userContext.name}! Welcome to EduPlatform. How can I help you today?`,
    `Hi there! I'm your AI assistant for EduPlatform. What would you like to know?`,
    `Greetings! I'm here to help you with your learning journey. What can I do for you?`,
    `Welcome back, ${userContext.name}! Ready to continue your learning adventure?`
  ];

  return {
    text: greetings[Math.floor(Math.random() * greetings.length)],
    type: 'greeting',
    actions: [
      { type: 'button', text: 'View Courses', action: 'view_courses' },
      { type: 'button', text: 'Get Help', action: 'help' },
      { type: 'button', text: 'My Progress', action: 'progress' }
    ]
  };
}

async function generateQuestionResponse(message, userContext, context) {
  // Mock question answering (in real app, use knowledge base or LLM)
  const responses = {
    'how to': 'Here\'s how you can get started: 1) Log in to your account, 2) Browse available courses, 3) Enroll in courses that interest you, 4) Track your progress in the dashboard.',
    'what is': 'EduPlatform is a modern Learning Management System that provides interactive courses, quizzes, and comprehensive student management tools.',
    'where can': 'You can find most features in your dashboard. Navigate using the menu on the left side of the screen.',
    'when will': 'Updates are typically released monthly. Check the announcements section for the latest information.'
  };

  let responseText = 'I understand you have a question. Let me help you with that.';
  
  for (const [pattern, response] of Object.entries(responses)) {
    if (message.toLowerCase().includes(pattern)) {
      responseText = response;
      break;
    }
  }

  return {
    text: responseText,
    type: 'question_answer',
    actions: [
      { type: 'link', text: 'Learn More', url: '/features-showcase.html' },
      { type: 'link', text: 'Contact Support', url: '/contact' }
    ]
  };
}

function generateHelpResponse(userContext) {
  const helpTopics = [
    'Getting Started',
    'Course Management',
    'Quiz System',
    'Progress Tracking',
    'Account Settings',
    'Technical Issues'
  ];

  return {
    text: `I'm here to help! Here are some topics I can assist you with:`,
    type: 'help',
    topics: helpTopics,
    actions: helpTopics.map(topic => ({
      type: 'button',
      text: topic,
      action: `help_${topic.toLowerCase().replace(' ', '_')}`
    }))
  };
}

async function generateCourseResponse(message, userContext, context) {
  // Mock course recommendations
  const courses = [
    { name: 'Introduction to Web Development', level: 'Beginner', duration: '4 weeks' },
    { name: 'Advanced JavaScript', level: 'Intermediate', duration: '6 weeks' },
    { name: 'React Fundamentals', level: 'Beginner', duration: '5 weeks' },
    { name: 'Node.js Backend Development', level: 'Intermediate', duration: '8 weeks' }
  ];

  return {
    text: `Based on your interests, here are some recommended courses:`,
    type: 'course_recommendation',
    courses,
    actions: [
      { type: 'button', text: 'Browse All Courses', action: 'browse_courses' },
      { type: 'button', text: 'My Enrolled Courses', action: 'my_courses' }
    ]
  };
}

async function generateTechnicalResponse(message, userContext, context) {
  return {
    text: `I understand you're experiencing a technical issue. Let me help you troubleshoot this. Can you provide more details about what's not working?`,
    type: 'technical_support',
    actions: [
      { type: 'button', text: 'Report Bug', action: 'report_bug' },
      { type: 'button', text: 'Contact Support', action: 'contact_support' },
      { type: 'button', text: 'System Status', action: 'system_status' }
    ]
  };
}

function generateFeedbackResponse(message, userContext, context) {
  return {
    text: `Thank you for your feedback! Your input helps us improve EduPlatform. We appreciate you taking the time to share your thoughts.`,
    type: 'feedback',
    actions: [
      { type: 'button', text: 'Submit Feedback Form', action: 'feedback_form' },
      { type: 'button', text: 'Feature Request', action: 'feature_request' }
    ]
  };
}

function generateDefaultResponse(message, userContext, context) {
  return {
    text: `I'm not sure I understand that. Could you rephrase your question or ask me about EduPlatform features, courses, or technical support?`,
    type: 'default',
    actions: [
      { type: 'button', text: 'Get Help', action: 'help' },
      { type: 'button', text: 'View Features', action: 'features' }
    ]
  };
}

function generateSuggestions(intent, userContext) {
  const suggestionMap = {
    greeting: ['Browse courses', 'Check my progress', 'Get help'],
    question: ['Learn more', 'Contact support', 'View documentation'],
    help: ['Getting started', 'Account settings', 'Technical support'],
    course_inquiry: ['View all courses', 'My enrolled courses', 'Course categories'],
    technical_support: ['Report issue', 'System status', 'Contact support'],
    feedback: ['Submit feedback', 'Feature request', 'Rate experience']
  };

  return suggestionMap[intent.type] || ['Get help', 'View features', 'Contact support'];
}

function generateAudioResponse(text) {
  // Mock audio generation (in real app, use text-to-speech service)
  return `/api/tts?text=${encodeURIComponent(text)}&voice=default`;
}

async function getUserContext(userId) {
  // Mock user context (in real app, fetch from database)
  return {
    id: userId,
    name: 'User',
    role: 'student',
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light'
    },
    recentActivity: [
      'Viewed course catalog',
      'Completed quiz',
      'Updated profile'
    ],
    enrolledCourses: [
      'Introduction to Web Development',
      'JavaScript Basics'
    ]
  };
}

async function saveConversation(conversation) {
  // Mock save (in real app, save to database)
  console.log('Saving conversation:', conversation);
  return true;
}

async function getChatHistory(userId, sessionId, limit) {
  // Mock chat history
  return [
    {
      id: 'msg_1',
      userId,
      sessionId,
      userMessage: 'Hello, I need help with my course',
      aiResponse: 'Hello! I\'d be happy to help you with your course. What specific question do you have?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg_2',
      userId,
      sessionId,
      userMessage: 'How do I submit an assignment?',
      aiResponse: 'To submit an assignment: 1) Go to your course dashboard, 2) Find the assignment, 3) Click "Submit Assignment", 4) Upload your files and add any comments, 5) Click "Submit".',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];
}

async function trackChatEvent(eventData) {
  // Mock analytics tracking
  console.log('Tracking chat event:', eventData);
  return true;
}
