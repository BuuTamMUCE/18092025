/**
 * AI Chatbot Component for EduPlatform
 * Integrates with Gemini AI for intelligent conversations
 */

class AIChatbot {
    constructor(containerId, apiKey) {
        this.containerId = containerId;
        this.apiKey = apiKey;
        this.geminiAI = null;
        this.isOpen = false;
        this.isTyping = false;
        this.chatHistory = [];
        this.currentContext = {};
        
        this.init();
    }

    /**
     * Initialize the chatbot
     */
    async init() {
        try {
            // Initialize Gemini AI
            this.geminiAI = new GeminiAI(this.apiKey);
            const initialized = await this.geminiAI.initialize();
            
            if (!initialized) {
                throw new Error('Failed to initialize Gemini AI');
            }

            // Create chatbot UI
            this.createUI();
            this.bindEvents();
            
            console.log('✅ AI Chatbot initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize AI Chatbot:', error);
            this.showError('Failed to initialize AI assistant. Please check your API key.');
        }
    }

    /**
     * Create chatbot UI
     */
    createUI() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('Container not found:', this.containerId);
            return;
        }

        container.innerHTML = `
            <div class="ai-chatbot-container fixed bottom-4 right-4 z-50">
                <!-- Chat Toggle Button -->
                <button id="ai-chat-toggle" class="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center group">
                    <svg id="chat-icon" class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <svg id="close-icon" class="w-6 h-6 transition-transform duration-300 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <!-- Chat Window -->
                <div id="ai-chat-window" class="hidden absolute bottom-16 right-0 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col">
                    <!-- Chat Header -->
                    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-primary text-white rounded-t-lg">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold">AI Assistant</h3>
                                <p class="text-xs opacity-90">Powered by Gemini</p>
                            </div>
                        </div>
                        <button id="ai-chat-minimize" class="text-white/80 hover:text-white transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Chat Messages -->
                    <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4">
                        <div class="ai-message ai-assistant-message">
                            <div class="flex items-start gap-2">
                                <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                    </svg>
                                </div>
                                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                                    <p class="text-sm text-gray-800 dark:text-gray-200">Hello! I'm your AI learning assistant. How can I help you today?</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Typing Indicator -->
                    <div id="ai-typing-indicator" class="hidden px-4 py-2">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                                <div class="flex space-x-1">
                                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex gap-2">
                            <input 
                                id="ai-chat-input" 
                                type="text" 
                                placeholder="Ask me anything about learning..."
                                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <button 
                                id="ai-chat-send" 
                                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="mt-2 flex flex-wrap gap-1">
                            <button class="quick-action-btn px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Help with quiz
                            </button>
                            <button class="quick-action-btn px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Study tips
                            </button>
                            <button class="quick-action-btn px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Course recommendations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle chat
        document.getElementById('ai-chat-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        // Minimize chat
        document.getElementById('ai-chat-minimize').addEventListener('click', () => {
            this.closeChat();
        });

        // Send message
        document.getElementById('ai-chat-send').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send on Enter key
        document.getElementById('ai-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                this.handleQuickAction(action);
            });
        });
    }

    /**
     * Toggle chat window
     */
    toggleChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-icon');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.remove('hidden');
            chatIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.getElementById('ai-chat-input').focus();
        } else {
            chatWindow.classList.add('hidden');
            chatIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }

    /**
     * Close chat window
     */
    closeChat() {
        this.isOpen = false;
        document.getElementById('ai-chat-window').classList.add('hidden');
        document.getElementById('chat-icon').classList.remove('hidden');
        document.getElementById('close-icon').classList.add('hidden');
    }

    /**
     * Send message
     */
    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const response = await this.geminiAI.chat(message, this.currentContext);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessage(response, 'assistant');
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.addMessage("I'm sorry, I'm having trouble processing your request right now. Please try again.", 'assistant');
        }
    }

    /**
     * Handle quick actions
     */
    async handleQuickAction(action) {
        let message = '';
        
        switch (action) {
            case 'Help with quiz':
                message = 'I can help you with quiz questions. What topic are you studying?';
                break;
            case 'Study tips':
                message = 'I can provide study tips. What subject would you like help with?';
                break;
            case 'Course recommendations':
                message = 'I can recommend courses based on your interests. What would you like to learn?';
                break;
            default:
                message = action;
        }
        
        document.getElementById('ai-chat-input').value = message;
        this.sendMessage();
    }

    /**
     * Add message to chat
     */
    addMessage(content, sender) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `ai-message ${sender === 'user' ? 'ai-user-message' : 'ai-assistant-message'}`;
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="flex items-start gap-2 justify-end">
                    <div class="bg-primary text-white rounded-lg p-3 max-w-xs">
                        <p class="text-sm">${this.escapeHtml(content)}</p>
                    </div>
                    <div class="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="flex items-start gap-2">
                    <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                        <p class="text-sm text-gray-800 dark:text-gray-200">${this.escapeHtml(content)}</p>
                    </div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Store in chat history
        this.chatHistory.push({
            sender,
            content,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        this.isTyping = true;
        document.getElementById('ai-typing-indicator').classList.remove('hidden');
        document.getElementById('ai-chat-messages').scrollTop = document.getElementById('ai-chat-messages').scrollHeight;
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        this.isTyping = false;
        document.getElementById('ai-typing-indicator').classList.add('hidden');
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show error message
     */
    showError(message) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        if (messagesContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'ai-message ai-assistant-message';
            errorDiv.innerHTML = `
                <div class="flex items-start gap-2">
                    <div class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="bg-red-100 dark:bg-red-900/20 rounded-lg p-3 max-w-xs">
                        <p class="text-sm text-red-800 dark:text-red-200">${this.escapeHtml(message)}</p>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(errorDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    /**
     * Update context
     */
    updateContext(context) {
        this.currentContext = { ...this.currentContext, ...context };
    }

    /**
     * Clear chat history
     */
    clearHistory() {
        this.chatHistory = [];
        if (this.geminiAI) {
            this.geminiAI.clearHistory();
        }
        document.getElementById('ai-chat-messages').innerHTML = `
            <div class="ai-message ai-assistant-message">
                <div class="flex items-start gap-2">
                    <div class="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                    </div>
                    <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                        <p class="text-sm text-gray-800 dark:text-gray-200">Hello! I'm your AI learning assistant. How can I help you today?</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Export for use in other modules
window.AIChatbot = AIChatbot;

