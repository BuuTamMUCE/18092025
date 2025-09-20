/**
 * WebRTC Manager for Live Streaming and Video Conferencing
 * Handles video calls, screen sharing, and live classes
 */

class WebRTCManager {
    constructor() {
        this.localStream = null;
        this.remoteStreams = new Map();
        this.peerConnections = new Map();
        this.roomId = null;
        this.isHost = false;
        this.isScreenSharing = false;
        this.recording = null;
        this.iceServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ];
        
        this.init();
    }

    /**
     * Initialize WebRTC Manager
     */
    async init() {
        try {
            // Check browser support
            if (!this.checkBrowserSupport()) {
                throw new Error('WebRTC not supported in this browser');
            }
            
            console.log('✅ WebRTC Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize WebRTC Manager:', error);
        }
    }

    /**
     * Check browser support for WebRTC
     */
    checkBrowserSupport() {
        return !!(navigator.mediaDevices && 
                 navigator.mediaDevices.getUserMedia && 
                 window.RTCPeerConnection);
    }

    /**
     * Start local camera and microphone
     */
    async startLocalStream(constraints = {}) {
        try {
            const defaultConstraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            };

            const finalConstraints = { ...defaultConstraints, ...constraints };
            this.localStream = await navigator.mediaDevices.getUserMedia(finalConstraints);
            
            console.log('✅ Local stream started');
            return this.localStream;
        } catch (error) {
            console.error('❌ Failed to start local stream:', error);
            throw error;
        }
    }

    /**
     * Start screen sharing
     */
    async startScreenShare() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'always',
                    displaySurface: 'monitor'
                },
                audio: true
            });

            this.isScreenSharing = true;
            this.localStream = screenStream;
            
            // Handle screen share end
            screenStream.getVideoTracks()[0].onended = () => {
                this.stopScreenShare();
            };

            console.log('✅ Screen sharing started');
            return screenStream;
        } catch (error) {
            console.error('❌ Failed to start screen share:', error);
            throw error;
        }
    }

    /**
     * Stop screen sharing
     */
    stopScreenShare() {
        if (this.isScreenSharing && this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.isScreenSharing = false;
            console.log('✅ Screen sharing stopped');
        }
    }

    /**
     * Create or join a room
     */
    async createRoom(roomId = null) {
        try {
            this.roomId = roomId || this.generateRoomId();
            this.isHost = true;
            
            // Start local stream
            await this.startLocalStream();
            
            // Create signaling server connection (simulated)
            this.setupSignaling();
            
            console.log(`✅ Room created: ${this.roomId}`);
            return this.roomId;
        } catch (error) {
            console.error('❌ Failed to create room:', error);
            throw error;
        }
    }

    /**
     * Join existing room
     */
    async joinRoom(roomId) {
        try {
            this.roomId = roomId;
            this.isHost = false;
            
            // Start local stream
            await this.startLocalStream();
            
            // Connect to signaling server
            this.setupSignaling();
            
            console.log(`✅ Joined room: ${this.roomId}`);
        } catch (error) {
            console.error('❌ Failed to join room:', error);
            throw error;
        }
    }

    /**
     * Setup signaling server connection
     */
    setupSignaling() {
        // Simulate signaling server with WebSocket
        this.signalingSocket = new WebSocket('wss://your-signaling-server.com');
        
        this.signalingSocket.onopen = () => {
            console.log('✅ Connected to signaling server');
            this.sendSignalingMessage({
                type: this.isHost ? 'create-room' : 'join-room',
                roomId: this.roomId
            });
        };

        this.signalingSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleSignalingMessage(message);
        };

        this.signalingSocket.onclose = () => {
            console.log('❌ Disconnected from signaling server');
        };
    }

    /**
     * Send signaling message
     */
    sendSignalingMessage(message) {
        if (this.signalingSocket && this.signalingSocket.readyState === WebSocket.OPEN) {
            this.signalingSocket.send(JSON.stringify(message));
        }
    }

    /**
     * Handle incoming signaling messages
     */
    async handleSignalingMessage(message) {
        switch (message.type) {
            case 'offer':
                await this.handleOffer(message);
                break;
            case 'answer':
                await this.handleAnswer(message);
                break;
            case 'ice-candidate':
                await this.handleIceCandidate(message);
                break;
            case 'user-joined':
                await this.handleUserJoined(message);
                break;
            case 'user-left':
                await this.handleUserLeft(message);
                break;
        }
    }

    /**
     * Create peer connection
     */
    async createPeerConnection(userId) {
        const peerConnection = new RTCPeerConnection({
            iceServers: this.iceServers
        });

        // Add local stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, this.localStream);
            });
        }

        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const remoteStream = event.streams[0];
            this.remoteStreams.set(userId, remoteStream);
            this.onRemoteStream(userId, remoteStream);
        };

        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendSignalingMessage({
                    type: 'ice-candidate',
                    roomId: this.roomId,
                    targetUserId: userId,
                    candidate: event.candidate
                });
            }
        };

        this.peerConnections.set(userId, peerConnection);
        return peerConnection;
    }

    /**
     * Handle offer from remote peer
     */
    async handleOffer(message) {
        const peerConnection = await this.createPeerConnection(message.userId);
        
        await peerConnection.setRemoteDescription(message.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        this.sendSignalingMessage({
            type: 'answer',
            roomId: this.roomId,
            targetUserId: message.userId,
            answer: answer
        });
    }

    /**
     * Handle answer from remote peer
     */
    async handleAnswer(message) {
        const peerConnection = this.peerConnections.get(message.userId);
        if (peerConnection) {
            await peerConnection.setRemoteDescription(message.answer);
        }
    }

    /**
     * Handle ICE candidate
     */
    async handleIceCandidate(message) {
        const peerConnection = this.peerConnections.get(message.userId);
        if (peerConnection) {
            await peerConnection.addIceCandidate(message.candidate);
        }
    }

    /**
     * Handle user joined
     */
    async handleUserJoined(message) {
        if (this.isHost) {
            const peerConnection = await this.createPeerConnection(message.userId);
            
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            this.sendSignalingMessage({
                type: 'offer',
                roomId: this.roomId,
                targetUserId: message.userId,
                offer: offer
            });
        }
    }

    /**
     * Handle user left
     */
    async handleUserLeft(message) {
        const peerConnection = this.peerConnections.get(message.userId);
        if (peerConnection) {
            peerConnection.close();
            this.peerConnections.delete(message.userId);
            this.remoteStreams.delete(message.userId);
        }
    }

    /**
     * Start recording
     */
    async startRecording() {
        try {
            const stream = this.isScreenSharing ? this.localStream : this.localStream;
            this.recording = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            const chunks = [];
            this.recording.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            this.recording.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                this.downloadRecording(blob);
            };

            this.recording.start();
            console.log('✅ Recording started');
        } catch (error) {
            console.error('❌ Failed to start recording:', error);
        }
    }

    /**
     * Stop recording
     */
    stopRecording() {
        if (this.recording && this.recording.state === 'recording') {
            this.recording.stop();
            console.log('✅ Recording stopped');
        }
    }

    /**
     * Download recording
     */
    downloadRecording(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recording-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Leave room
     */
    leaveRoom() {
        // Stop all tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        // Close all peer connections
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();
        this.remoteStreams.clear();

        // Close signaling connection
        if (this.signalingSocket) {
            this.signalingSocket.close();
        }

        console.log('✅ Left room');
    }

    /**
     * Generate room ID
     */
    generateRoomId() {
        return Math.random().toString(36).substring(2, 15);
    }

    /**
     * Callback for remote stream
     */
    onRemoteStream(userId, stream) {
        console.log(`✅ Remote stream received from ${userId}`);
        // Override this method to handle remote streams
    }

    /**
     * Get local stream
     */
    getLocalStream() {
        return this.localStream;
    }

    /**
     * Get remote streams
     */
    getRemoteStreams() {
        return this.remoteStreams;
    }

    /**
     * Get room ID
     */
    getRoomId() {
        return this.roomId;
    }

    /**
     * Check if screen sharing
     */
    isScreenSharingActive() {
        return this.isScreenSharing;
    }

    /**
     * Check if recording
     */
    isRecordingActive() {
        return this.recording && this.recording.state === 'recording';
    }
}

// Export for use in other modules
window.WebRTCManager = WebRTCManager;

