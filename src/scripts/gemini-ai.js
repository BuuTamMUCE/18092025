/**
 * Gemini AI Integration for EduPlatform
 * Provides AI-powered features using Google's Gemini API
 */

class GeminiAI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.isInitialized = false;
        this.conversationHistory = [];
        this.maxHistoryLength = 10;
    }

    /**
     * Initialize Gemini AI
     */
    async initialize() {
        try {
            if (!this.apiKey) {
                throw new Error('Gemini API key is required');
            }
            
            // Test API connection
            await this.testConnection();
            this.isInitialized = true;
            console.log('✅ Gemini AI initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Gemini AI:', error);
            return false;
        }
    }

    /**
     * Test API connection
     */
    async testConnection() {
        const response = await this.generateContent('Hello, are you working?');
        return response;
    }

    /**
     * Generate content using Gemini API
     */
    async generateContent(prompt, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Gemini AI not initialized');
        }

        try {
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature || 0.7,
                    topK: options.topK || 40,
                    topP: options.topP || 0.95,
                    maxOutputTokens: options.maxTokens || 1024,
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            };

            const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Error generating content:', error);
            throw error;
        }
    }

    /**
     * Chat with AI (with conversation history)
     */
    async chat(message, context = {}) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: message,
                timestamp: new Date().toISOString()
            });

            // Build context-aware prompt
            let prompt = this.buildContextPrompt(message, context);
            
            // Add conversation history
            if (this.conversationHistory.length > 1) {
                const history = this.conversationHistory.slice(-this.maxHistoryLength);
                const historyText = history.map(msg => 
                    `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`
                ).join('\n');
                prompt = `Previous conversation:\n${historyText}\n\nCurrent message: ${message}`;
            }

            const response = await this.generateContent(prompt, {
                temperature: 0.8,
                maxTokens: 512
            });

            // Add AI response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: response,
                timestamp: new Date().toISOString()
            });

            // Keep only recent history
            if (this.conversationHistory.length > this.maxHistoryLength) {
                this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
            }

            return response;
        } catch (error) {
            console.error('Error in chat:', error);
            return "I'm sorry, I'm having trouble processing your request right now. Please try again.";
        }
    }

    /**
     * Build context-aware prompt
     */
    buildContextPrompt(message, context) {
        let prompt = `You are an AI assistant for EduPlatform, a learning management system. `;
        
        if (context.userType === 'student') {
            prompt += `You are helping a student with their learning journey. `;
        } else if (context.userType === 'admin') {
            prompt += `You are helping an administrator manage the learning platform. `;
        }

        if (context.currentCourse) {
            prompt += `The user is currently studying: ${context.currentCourse}. `;
        }

        if (context.currentLesson) {
            prompt += `They are on lesson: ${context.currentLesson}. `;
        }

        prompt += `Provide helpful, educational, and encouraging responses. Be concise but informative. `;
        prompt += `If asked about specific topics, provide educational insights and learning tips. `;
        prompt += `Always maintain a positive and supportive tone. `;
        prompt += `\n\nUser message: ${message}`;

        return prompt;
    }

    /**
     * Generate course recommendations
     */
    async generateCourseRecommendations(userProfile, preferences = {}) {
        const prompt = `Based on the following user profile and preferences, recommend 5 relevant courses for learning:

User Profile:
- Interests: ${userProfile.interests?.join(', ') || 'General learning'}
- Current Level: ${userProfile.level || 'Beginner'}
- Learning Goals: ${userProfile.goals?.join(', ') || 'Skill development'}
- Available Time: ${userProfile.timeAvailable || 'Flexible'}

Preferences:
- Difficulty: ${preferences.difficulty || 'Any'}
- Duration: ${preferences.duration || 'Any'}
- Category: ${preferences.category || 'Any'}

Please provide 5 course recommendations with:
1. Course title
2. Brief description
3. Difficulty level
4. Estimated duration
5. Why it's recommended

Format as a JSON array.`;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.7,
                maxTokens: 1024
            });
            return this.parseCourseRecommendations(response);
        } catch (error) {
            console.error('Error generating course recommendations:', error);
            return [];
        }
    }

    /**
     * Parse course recommendations from AI response
     */
    parseCourseRecommendations(response) {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // Fallback: parse text format
            const lines = response.split('\n').filter(line => line.trim());
            const recommendations = [];
            
            for (let i = 0; i < lines.length; i += 5) {
                if (i + 4 < lines.length) {
                    recommendations.push({
                        title: lines[i].replace(/^\d+\.\s*/, ''),
                        description: lines[i + 1],
                        difficulty: lines[i + 2],
                        duration: lines[i + 3],
                        reason: lines[i + 4]
                    });
                }
            }
            
            return recommendations;
        } catch (error) {
            console.error('Error parsing course recommendations:', error);
            return [];
        }
    }

    /**
     * Generate quiz questions
     */
    async generateQuizQuestions(topic, difficulty = 'medium', count = 5) {
        const prompt = `Generate ${count} ${difficulty} difficulty quiz questions about "${topic}".

For each question, provide:
1. Question text
2. 4 multiple choice options (A, B, C, D)
3. Correct answer (A, B, C, or D)
4. Brief explanation

Format as JSON array with this structure:
[
  {
    "question": "Question text here",
    "options": {
      "A": "Option A",
      "B": "Option B", 
      "C": "Option C",
      "D": "Option D"
    },
    "correctAnswer": "A",
    "explanation": "Explanation here"
  }
]`;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.8,
                maxTokens: 2048
            });
            return this.parseQuizQuestions(response);
        } catch (error) {
            console.error('Error generating quiz questions:', error);
            return [];
        }
    }

    /**
     * Parse quiz questions from AI response
     */
    parseQuizQuestions(response) {
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [];
        } catch (error) {
            console.error('Error parsing quiz questions:', error);
            return [];
        }
    }

    /**
     * Analyze learning progress
     */
    async analyzeLearningProgress(progressData) {
        const prompt = `Analyze the following learning progress data and provide insights and recommendations:

Progress Data:
- Courses Completed: ${progressData.coursesCompleted || 0}
- Total Study Time: ${progressData.totalStudyTime || 0} hours
- Quiz Scores: ${JSON.stringify(progressData.quizScores || [])}
- Current Streak: ${progressData.currentStreak || 0} days
- Weak Areas: ${progressData.weakAreas?.join(', ') || 'None identified'}

Provide:
1. Overall performance assessment
2. Strengths identified
3. Areas for improvement
4. Specific recommendations
5. Motivational message

Keep it concise but helpful.`;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.7,
                maxTokens: 512
            });
            return response;
        } catch (error) {
            console.error('Error analyzing learning progress:', error);
            return "Unable to analyze progress at this time.";
        }
    }

    /**
     * Generate study tips
     */
    async generateStudyTips(topic, context = {}) {
        const prompt = `Provide 5 practical study tips for learning "${topic}".

Context:
- User Level: ${context.level || 'Beginner'}
- Study Time Available: ${context.timeAvailable || 'Flexible'}
- Learning Style: ${context.learningStyle || 'Visual'}

Make tips specific, actionable, and relevant to the topic.`;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.8,
                maxTokens: 512
            });
            return response;
        } catch (error) {
            console.error('Error generating study tips:', error);
            return "Study tips will be available soon.";
        }
    }

    /**
     * Translate content
     */
    async translateContent(text, targetLanguage = 'en') {
        const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else:

${text}`;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.3,
                maxTokens: 256
            });
            return response.trim();
        } catch (error) {
            console.error('Error translating content:', error);
            return text; // Return original text if translation fails
        }
    }

    /**
     * Summarize content
     */
    async summarizeContent(content, maxLength = 200) {
        const prompt = `Summarize the following content in approximately ${maxLength} words. Focus on key points and main ideas:

${content}`;

        try {
            const response = await this.generateContent(prompt, {
                temperature: 0.5,
                maxTokens: 512
            });
            return response;
        } catch (error) {
            console.error('Error summarizing content:', error);
            return content.substring(0, maxLength) + '...';
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }
}

// Export for use in other modules
window.GeminiAI = GeminiAI;

