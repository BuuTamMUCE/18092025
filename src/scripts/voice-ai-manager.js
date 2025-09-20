/**
 * Voice AI Manager with Web Speech API
 * Handles voice commands, speech-to-text, text-to-speech, and voice notes
 */

class VoiceAIManager {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.isSpeaking = false;
        this.currentLanguage = 'en-US';
        this.voiceCommands = new Map();
        this.voiceNotes = [];
        this.isSupported = false;
        
        this.init();
    }

    /**
     * Initialize Voice AI Manager
     */
    init() {
        try {
            // Check browser support
            this.isSupported = this.checkBrowserSupport();
            
            if (!this.isSupported) {
                console.warn('⚠️ Web Speech API not supported in this browser');
                return;
            }

            // Initialize speech recognition
            this.initSpeechRecognition();
            
            // Initialize speech synthesis
            this.initSpeechSynthesis();
            
            // Setup default voice commands
            this.setupDefaultCommands();
            
            console.log('✅ Voice AI Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Voice AI Manager:', error);
        }
    }

    /**
     * Check browser support
     */
    checkBrowserSupport() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    /**
     * Initialize speech recognition
     */
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.onListeningStart();
        };
        
        this.recognition.onresult = (event) => {
            this.handleSpeechResult(event);
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.onListeningError(event.error);
        };
        
        this.recognition.onend = () => {
            this.isListening = false;
            this.onListeningEnd();
        };
    }

    /**
     * Initialize speech synthesis
     */
    initSpeechSynthesis() {
        this.synthesis = window.speechSynthesis;
        
        // Get available voices
        this.loadVoices();
        
        // Some browsers load voices asynchronously
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    /**
     * Load available voices
     */
    loadVoices() {
        this.voices = this.synthesis.getVoices();
        console.log('✅ Voices loaded:', this.voices.length);
    }

    /**
     * Start listening
     */
    startListening() {
        if (!this.isSupported) {
            throw new Error('Speech recognition not supported');
        }

        if (this.isListening) {
            console.log('Already listening');
            return;
        }

        try {
            this.recognition.start();
            console.log('✅ Started listening');
        } catch (error) {
            console.error('❌ Failed to start listening:', error);
            throw error;
        }
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.isListening) {
            this.recognition.stop();
            console.log('✅ Stopped listening');
        }
    }

    /**
     * Handle speech recognition result
     */
    handleSpeechResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Update UI with interim results
        this.onInterimResult(interimTranscript);

        // Process final results
        if (finalTranscript) {
            this.processVoiceCommand(finalTranscript.trim());
            this.onFinalResult(finalTranscript);
        }
    }

    /**
     * Process voice command
     */
    processVoiceCommand(command) {
        const normalizedCommand = command.toLowerCase();
        
        // Check for exact matches
        if (this.voiceCommands.has(normalizedCommand)) {
            const handler = this.voiceCommands.get(normalizedCommand);
            handler(command);
            return;
        }

        // Check for partial matches
        for (const [key, handler] of this.voiceCommands) {
            if (normalizedCommand.includes(key)) {
                handler(command);
                return;
            }
        }

        // Default: treat as general speech
        this.onGeneralSpeech(command);
    }

    /**
     * Add voice command
     */
    addVoiceCommand(command, handler) {
        this.voiceCommands.set(command.toLowerCase(), handler);
        console.log(`✅ Voice command added: "${command}"`);
    }

    /**
     * Remove voice command
     */
    removeVoiceCommand(command) {
        this.voiceCommands.delete(command.toLowerCase());
        console.log(`✅ Voice command removed: "${command}"`);
    }

    /**
     * Setup default voice commands
     */
    setupDefaultCommands() {
        // Navigation commands
        this.addVoiceCommand('go home', () => {
            window.location.href = 'index.html';
        });
        
        this.addVoiceCommand('go back', () => {
            window.history.back();
        });
        
        this.addVoiceCommand('refresh', () => {
            window.location.reload();
        });

        // Learning commands
        this.addVoiceCommand('start quiz', () => {
            window.location.href = 'quiz_interface_1/code.html';
        });
        
        this.addVoiceCommand('start course', () => {
            window.location.href = 'course_player_interface_1/code.html';
        });
        
        this.addVoiceCommand('open dashboard', () => {
            window.location.href = 'ai-dashboard.html';
        });

        // Voice control commands
        this.addVoiceCommand('stop listening', () => {
            this.stopListening();
        });
        
        this.addVoiceCommand('start listening', () => {
            this.startListening();
        });

        // Help command
        this.addVoiceCommand('help', () => {
            this.speak('Available commands: go home, go back, refresh, start quiz, start course, open dashboard, stop listening, start listening, help');
        });
    }

    /**
     * Speak text
     */
    speak(text, options = {}) {
        if (!this.synthesis) {
            console.error('Speech synthesis not available');
            return;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        if (options.voice) {
            utterance.voice = options.voice;
        } else if (this.voices.length > 0) {
            // Use first English voice or default
            const englishVoice = this.voices.find(voice => voice.lang.startsWith('en'));
            utterance.voice = englishVoice || this.voices[0];
        }

        // Set options
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
        utterance.lang = options.lang || this.currentLanguage;

        // Event handlers
        utterance.onstart = () => {
            this.isSpeaking = true;
            this.onSpeakingStart(text);
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.onSpeakingEnd();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            this.isSpeaking = false;
            this.onSpeakingError(event.error);
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Stop speaking
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            console.log('✅ Stopped speaking');
        }
    }

    /**
     * Convert speech to text
     */
    async speechToText() {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                reject(new Error('Speech recognition not supported'));
                return;
            }

            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = this.currentLanguage;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                resolve(transcript);
            };

            recognition.onerror = (event) => {
                reject(new Error(event.error));
            };

            recognition.start();
        });
    }

    /**
     * Convert text to speech
     */
    async textToSpeech(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (!this.synthesis) {
                reject(new Error('Speech synthesis not available'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            
            if (options.voice) {
                utterance.voice = options.voice;
            }

            utterance.rate = options.rate || 1;
            utterance.pitch = options.pitch || 1;
            utterance.volume = options.volume || 1;
            utterance.lang = options.lang || this.currentLanguage;

            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(new Error(event.error));

            this.synthesis.speak(utterance);
        });
    }

    /**
     * Record voice note
     */
    startVoiceNote() {
        if (this.isListening) {
            console.log('Already recording voice note');
            return;
        }

        this.currentVoiceNote = {
            id: Date.now(),
            startTime: new Date(),
            transcript: '',
            isRecording: true
        };

        this.startListening();
        console.log('✅ Started recording voice note');
    }

    /**
     * Stop voice note
     */
    stopVoiceNote() {
        if (this.currentVoiceNote && this.currentVoiceNote.isRecording) {
            this.currentVoiceNote.endTime = new Date();
            this.currentVoiceNote.isRecording = false;
            this.currentVoiceNote.duration = this.currentVoiceNote.endTime - this.currentVoiceNote.startTime;
            
            this.voiceNotes.push(this.currentVoiceNote);
            this.stopListening();
            
            console.log('✅ Voice note recorded:', this.currentVoiceNote);
            this.onVoiceNoteRecorded(this.currentVoiceNote);
        }
    }

    /**
     * Get voice notes
     */
    getVoiceNotes() {
        return this.voiceNotes;
    }

    /**
     * Delete voice note
     */
    deleteVoiceNote(noteId) {
        const index = this.voiceNotes.findIndex(note => note.id === noteId);
        if (index > -1) {
            this.voiceNotes.splice(index, 1);
            console.log('✅ Voice note deleted:', noteId);
        }
    }

    /**
     * Set language
     */
    setLanguage(language) {
        this.currentLanguage = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
        console.log('✅ Language set to:', language);
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return [
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'es-ES', name: 'Spanish' },
            { code: 'fr-FR', name: 'French' },
            { code: 'de-DE', name: 'German' },
            { code: 'it-IT', name: 'Italian' },
            { code: 'pt-BR', name: 'Portuguese (Brazil)' },
            { code: 'ru-RU', name: 'Russian' },
            { code: 'ja-JP', name: 'Japanese' },
            { code: 'ko-KR', name: 'Korean' },
            { code: 'zh-CN', name: 'Chinese (Simplified)' },
            { code: 'ar-SA', name: 'Arabic' }
        ];
    }

    /**
     * Get available voices
     */
    getAvailableVoices() {
        return this.voices || [];
    }

    /**
     * Get status
     */
    getStatus() {
        return {
            isSupported: this.isSupported,
            isListening: this.isListening,
            isSpeaking: this.isSpeaking,
            currentLanguage: this.currentLanguage,
            voiceCommandsCount: this.voiceCommands.size,
            voiceNotesCount: this.voiceNotes.length
        };
    }

    // Event handlers (to be overridden)
    onListeningStart() {
        console.log('🎤 Started listening');
    }

    onListeningEnd() {
        console.log('🎤 Stopped listening');
    }

    onListeningError(error) {
        console.error('🎤 Listening error:', error);
    }

    onInterimResult(transcript) {
        console.log('🎤 Interim:', transcript);
    }

    onFinalResult(transcript) {
        console.log('🎤 Final:', transcript);
    }

    onGeneralSpeech(text) {
        console.log('🎤 General speech:', text);
    }

    onSpeakingStart(text) {
        console.log('🔊 Started speaking:', text);
    }

    onSpeakingEnd() {
        console.log('🔊 Finished speaking');
    }

    onSpeakingError(error) {
        console.error('🔊 Speaking error:', error);
    }

    onVoiceNoteRecorded(note) {
        console.log('📝 Voice note recorded:', note);
    }
}

// Export for use in other modules
window.VoiceAIManager = VoiceAIManager;

