/**
 * WebSocket Manager for Real-time Collaboration
 * Handles live chat, collaborative documents, and real-time updates
 */

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 1000;
        this.heartbeatInterval = 30000;
        this.heartbeatTimer = null;
        this.messageQueue = [];
        this.eventListeners = new Map();
        this.roomId = null;
        this.userId = null;
        this.userName = null;
        
        this.init();
    }

    /**
     * Initialize WebSocket Manager
     */
    init() {
        // Check if WebSocket is supported
        if (!window.WebSocket) {
            console.error('❌ WebSocket not supported in this browser');
            return;
        }
        
        console.log('✅ WebSocket Manager initialized');
    }

    /**
     * Connect to WebSocket server
     */
    connect(serverUrl = 'wss://your-websocket-server.com') {
        try {
            this.socket = new WebSocket(serverUrl);
            
            this.socket.onopen = (event) => {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                console.log('✅ WebSocket connected');
                this.emit('connected', event);
                this.startHeartbeat();
                this.processMessageQueue();
            };
            
            this.socket.onmessage = (event) => {
                this.handleMessage(event);
            };
            
            this.socket.onclose = (event) => {
                this.isConnected = false;
                console.log('❌ WebSocket disconnected:', event.code, event.reason);
                this.emit('disconnected', event);
                this.stopHeartbeat();
                this.attemptReconnect();
            };
            
            this.socket.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                this.emit('error', error);
            };
            
        } catch (error) {
            console.error('❌ Failed to connect to WebSocket:', error);
            this.emit('error', error);
        }
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.isConnected = false;
        this.stopHeartbeat();
    }

    /**
     * Join a room
     */
    joinRoom(roomId, userId, userName) {
        this.roomId = roomId;
        this.userId = userId;
        this.userName = userName;
        
        this.sendMessage({
            type: 'join-room',
            roomId: roomId,
            userId: userId,
            userName: userName
        });
    }

    /**
     * Leave current room
     */
    leaveRoom() {
        if (this.roomId) {
            this.sendMessage({
                type: 'leave-room',
                roomId: this.roomId,
                userId: this.userId
            });
            
            this.roomId = null;
            this.userId = null;
            this.userName = null;
        }
    }

    /**
     * Send message
     */
    sendMessage(message) {
        if (this.isConnected && this.socket) {
            try {
                this.socket.send(JSON.stringify(message));
            } catch (error) {
                console.error('❌ Failed to send message:', error);
                this.queueMessage(message);
            }
        } else {
            this.queueMessage(message);
        }
    }

    /**
     * Queue message for later sending
     */
    queueMessage(message) {
        this.messageQueue.push({
            message: message,
            timestamp: Date.now()
        });
    }

    /**
     * Process queued messages
     */
    processMessageQueue() {
        while (this.messageQueue.length > 0 && this.isConnected) {
            const queuedMessage = this.messageQueue.shift();
            this.sendMessage(queuedMessage.message);
        }
    }

    /**
     * Handle incoming messages
     */
    handleMessage(event) {
        try {
            const data = JSON.parse(event.data);
            
            switch (data.type) {
                case 'chat-message':
                    this.emit('chat-message', data);
                    break;
                case 'user-joined':
                    this.emit('user-joined', data);
                    break;
                case 'user-left':
                    this.emit('user-left', data);
                    break;
                case 'typing-start':
                    this.emit('typing-start', data);
                    break;
                case 'typing-stop':
                    this.emit('typing-stop', data);
                    break;
                case 'document-update':
                    this.emit('document-update', data);
                    break;
                case 'poll-update':
                    this.emit('poll-update', data);
                    break;
                case 'quiz-update':
                    this.emit('quiz-update', data);
                    break;
                case 'pong':
                    // Heartbeat response
                    break;
                default:
                    this.emit('message', data);
            }
        } catch (error) {
            console.error('❌ Failed to parse message:', error);
        }
    }

    /**
     * Send chat message
     */
    sendChatMessage(message, messageType = 'text') {
        this.sendMessage({
            type: 'chat-message',
            roomId: this.roomId,
            userId: this.userId,
            userName: this.userName,
            message: message,
            messageType: messageType,
            timestamp: Date.now()
        });
    }

    /**
     * Send typing indicator
     */
    sendTypingStart() {
        this.sendMessage({
            type: 'typing-start',
            roomId: this.roomId,
            userId: this.userId,
            userName: this.userName
        });
    }

    /**
     * Stop typing indicator
     */
    sendTypingStop() {
        this.sendMessage({
            type: 'typing-stop',
            roomId: this.roomId,
            userId: this.userId
        });
    }

    /**
     * Send document update
     */
    sendDocumentUpdate(documentId, changes) {
        this.sendMessage({
            type: 'document-update',
            roomId: this.roomId,
            userId: this.userId,
            documentId: documentId,
            changes: changes,
            timestamp: Date.now()
        });
    }

    /**
     * Send poll update
     */
    sendPollUpdate(pollId, optionId) {
        this.sendMessage({
            type: 'poll-update',
            roomId: this.roomId,
            userId: this.userId,
            pollId: pollId,
            optionId: optionId,
            timestamp: Date.now()
        });
    }

    /**
     * Send quiz update
     */
    sendQuizUpdate(quizId, questionId, answer) {
        this.sendMessage({
            type: 'quiz-update',
            roomId: this.roomId,
            userId: this.userId,
            quizId: quizId,
            questionId: questionId,
            answer: answer,
            timestamp: Date.now()
        });
    }

    /**
     * Start heartbeat
     */
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected) {
                this.sendMessage({ type: 'ping' });
            }
        }, this.heartbeatInterval);
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * Attempt to reconnect
     */
    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
            
            console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.error('❌ Max reconnection attempts reached');
            this.emit('max-reconnect-attempts-reached');
        }
    }

    /**
     * Add event listener
     */
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Emit event
     */
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get connection status
     */
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
            roomId: this.roomId,
            userId: this.userId,
            userName: this.userName
        };
    }

    /**
     * Get queued messages count
     */
    getQueuedMessagesCount() {
        return this.messageQueue.length;
    }
}

// Export for use in other modules
window.WebSocketManager = WebSocketManager;

