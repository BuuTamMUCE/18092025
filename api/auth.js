/**
 * Serverless Function - Authentication API
 * Handles user authentication and session management
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, body } = req;

  try {
    switch (method) {
      case 'POST':
        return await handleLogin(req, res);
      case 'GET':
        return await handleGetUser(req, res);
      case 'PUT':
        return await handleUpdateUser(req, res);
      case 'DELETE':
        return await handleLogout(req, res);
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleLogin(req, res) {
  const { email, password, userType } = req.body;
  
  // Validate input
  if (!email || !password || !userType) {
    return res.status(400).json({ 
      error: 'Missing required fields: email, password, userType' 
    });
  }

  // Mock authentication (in real app, this would be database lookup)
  const users = {
    'admin@eduplatform.com': {
      id: 'admin_001',
      email: 'admin@eduplatform.com',
      password: 'admin123', // In real app, this would be hashed
      role: 'admin',
      name: 'Admin User',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_courses'],
      profile: {
        avatar: '/assets/avatars/admin.jpg',
        department: 'IT',
        lastLogin: new Date().toISOString()
      }
    },
    'student@eduplatform.com': {
      id: 'student_001',
      email: 'student@eduplatform.com',
      password: 'student123',
      role: 'student',
      name: 'Student User',
      permissions: ['read', 'enroll', 'submit_quiz'],
      profile: {
        avatar: '/assets/avatars/student.jpg',
        grade: 'Grade 10',
        progress: 75,
        lastLogin: new Date().toISOString()
      }
    },
    'teacher@eduplatform.com': {
      id: 'teacher_001',
      email: 'teacher@eduplatform.com',
      password: 'teacher123',
      role: 'teacher',
      name: 'Teacher User',
      permissions: ['read', 'write', 'manage_courses', 'grade_assignments'],
      profile: {
        avatar: '/assets/avatars/teacher.jpg',
        subject: 'Mathematics',
        experience: '5 years',
        lastLogin: new Date().toISOString()
      }
    }
  };

  const user = users[email];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS'
    });
  }

  // Check user type match
  if (userType !== user.role && userType !== 'any') {
    return res.status(403).json({ 
      error: 'Invalid user type for this account',
      code: 'INVALID_USER_TYPE'
    });
  }

  // Generate session token (in real app, use JWT)
  const sessionToken = generateSessionToken(user.id);
  
  // Update last login
  user.profile.lastLogin = new Date().toISOString();

  // Return user data (without password)
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    success: true,
    user: userWithoutPassword,
    sessionToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    message: 'Login successful'
  });
}

async function handleGetUser(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing or invalid authorization header',
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.substring(7);
  const userId = validateSessionToken(token);
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }

  // Mock user data (in real app, fetch from database)
  const user = await getUserById(userId);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    success: true,
    user: userWithoutPassword
  });
}

async function handleUpdateUser(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing or invalid authorization header',
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.substring(7);
  const userId = validateSessionToken(token);
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }

  const { name, profile } = req.body;
  
  // Validate input
  if (!name && !profile) {
    return res.status(400).json({ 
      error: 'No fields to update' 
    });
  }

  // Mock update (in real app, update database)
  const user = await getUserById(userId);
  
  if (!user) {
    return res.status(404).json({ 
      error: 'User not found',
      code: 'USER_NOT_FOUND'
    });
  }

  // Update user data
  if (name) user.name = name;
  if (profile) user.profile = { ...user.profile, ...profile };
  
  user.updatedAt = new Date().toISOString();

  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    success: true,
    user: userWithoutPassword,
    message: 'User updated successfully'
  });
}

async function handleLogout(req, res) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Missing or invalid authorization header',
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.substring(7);
  const userId = validateSessionToken(token);
  
  if (!userId) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }

  // In real app, invalidate token in database/cache
  // For now, just return success
  
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}

// Helper functions
function generateSessionToken(userId) {
  // In real app, use JWT or similar
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64');
}

function validateSessionToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId, timestamp] = decoded.split(':');
    
    // Check if token is not older than 24 hours
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return null;
    }
    
    return userId;
  } catch (error) {
    return null;
  }
}

async function getUserById(userId) {
  // Mock user data (in real app, fetch from database)
  const users = {
    'admin_001': {
      id: 'admin_001',
      email: 'admin@eduplatform.com',
      role: 'admin',
      name: 'Admin User',
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_courses'],
      profile: {
        avatar: '/assets/avatars/admin.jpg',
        department: 'IT',
        lastLogin: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'student_001': {
      id: 'student_001',
      email: 'student@eduplatform.com',
      role: 'student',
      name: 'Student User',
      permissions: ['read', 'enroll', 'submit_quiz'],
      profile: {
        avatar: '/assets/avatars/student.jpg',
        grade: 'Grade 10',
        progress: 75,
        lastLogin: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    'teacher_001': {
      id: 'teacher_001',
      email: 'teacher@eduplatform.com',
      role: 'teacher',
      name: 'Teacher User',
      permissions: ['read', 'write', 'manage_courses', 'grade_assignments'],
      profile: {
        avatar: '/assets/avatars/teacher.jpg',
        subject: 'Mathematics',
        experience: '5 years',
        lastLogin: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  
  return users[userId] || null;
}
