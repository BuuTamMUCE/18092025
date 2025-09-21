/**
 * Machine Learning Manager with TensorFlow.js
 * Handles facial recognition, emotion detection, content recommendation, and predictive analytics
 */

class MLManager {
    constructor() {
        this.models = new Map();
        this.isInitialized = false;
        this.faceDetectionModel = null;
        this.emotionModel = null;
        this.recommendationModel = null;
        this.predictiveModel = null;
        this.isLoading = false;
        
        this.init();
    }

    /**
     * Initialize ML Manager
     */
    async init() {
        try {
            // Check if TensorFlow.js is available
            if (typeof tf === 'undefined') {
                console.error('❌ TensorFlow.js not loaded');
                return;
            }

            // Set backend
            await tf.setBackend('webgl');
            await tf.ready();
            
            console.log('✅ TensorFlow.js backend:', tf.getBackend());
            this.isInitialized = true;
            
            // Load models
            await this.loadModels();
            
            console.log('✅ ML Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize ML Manager:', error);
        }
    }

    /**
     * Load all ML models
     */
    async loadModels() {
        this.isLoading = true;
        
        try {
            // Load face detection model
            await this.loadFaceDetectionModel();
            
            // Load emotion detection model
            await this.loadEmotionModel();
            
            // Load recommendation model
            await this.loadRecommendationModel();
            
            // Load predictive analytics model
            await this.loadPredictiveModel();
            
            console.log('✅ All ML models loaded');
        } catch (error) {
            console.error('❌ Failed to load models:', error);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Load face detection model
     */
    async loadFaceDetectionModel() {
        try {
            // Load BlazeFace model for face detection
            this.faceDetectionModel = await blazeface.load();
            this.models.set('faceDetection', this.faceDetectionModel);
            console.log('✅ Face detection model loaded');
        } catch (error) {
            console.error('❌ Failed to load face detection model:', error);
        }
    }

    /**
     * Load emotion detection model
     */
    async loadEmotionModel() {
        try {
            // Create a simple emotion detection model
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [48 * 48], units: 128, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.5 }),
                    tf.layers.dense({ units: 64, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.5 }),
                    tf.layers.dense({ units: 7, activation: 'softmax' }) // 7 emotions
                ]
            });

            // Compile model
            model.compile({
                optimizer: 'adam',
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy']
            });

            this.emotionModel = model;
            this.models.set('emotion', this.emotionModel);
            console.log('✅ Emotion detection model loaded');
        } catch (error) {
            console.error('❌ Failed to load emotion model:', error);
        }
    }

    /**
     * Load recommendation model
     */
    async loadRecommendationModel() {
        try {
            // Create a collaborative filtering model
            const model = tf.sequential({
                layers: [
                    tf.layers.embedding({ inputDim: 1000, outputDim: 50, inputLength: 1 }),
                    tf.layers.flatten(),
                    tf.layers.dense({ units: 128, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.3 }),
                    tf.layers.dense({ units: 64, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.3 }),
                    tf.layers.dense({ units: 1, activation: 'sigmoid' })
                ]
            });

            model.compile({
                optimizer: 'adam',
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });

            this.recommendationModel = model;
            this.models.set('recommendation', this.recommendationModel);
            console.log('✅ Recommendation model loaded');
        } catch (error) {
            console.error('❌ Failed to load recommendation model:', error);
        }
    }

    /**
     * Load predictive analytics model
     */
    async loadPredictiveModel() {
        try {
            // Create a predictive model for learning outcomes
            const model = tf.sequential({
                layers: [
                    tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.dense({ units: 32, activation: 'relu' }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.dense({ units: 16, activation: 'relu' }),
                    tf.layers.dense({ units: 1, activation: 'sigmoid' })
                ]
            });

            model.compile({
                optimizer: 'adam',
                loss: 'meanSquaredError',
                metrics: ['mae']
            });

            this.predictiveModel = model;
            this.models.set('predictive', this.predictiveModel);
            console.log('✅ Predictive analytics model loaded');
        } catch (error) {
            console.error('❌ Failed to load predictive model:', error);
        }
    }

    /**
     * Detect faces in image
     */
    async detectFaces(imageElement) {
        try {
            if (!this.faceDetectionModel) {
                throw new Error('Face detection model not loaded');
            }

            const predictions = await this.faceDetectionModel.estimateFaces(imageElement);
            return predictions;
        } catch (error) {
            console.error('❌ Face detection failed:', error);
            throw error;
        }
    }

    /**
     * Detect emotions in face
     */
    async detectEmotion(faceImage) {
        try {
            if (!this.emotionModel) {
                throw new Error('Emotion model not loaded');
            }

            // Preprocess image
            const tensor = tf.browser.fromPixels(faceImage)
                .resizeNearestNeighbor([48, 48])
                .mean(2)
                .expandDims(0)
                .expandDims(-1)
                .div(255);

            // Predict emotion
            const prediction = this.emotionModel.predict(tensor);
            const emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
            const emotionIndex = prediction.argMax(1).dataSync()[0];
            const confidence = prediction.max().dataSync()[0];

            tensor.dispose();
            prediction.dispose();

            return {
                emotion: emotions[emotionIndex],
                confidence: confidence
            };
        } catch (error) {
            console.error('❌ Emotion detection failed:', error);
            throw error;
        }
    }

    /**
     * Get course recommendations
     */
    async getRecommendations(userId, userHistory, availableCourses) {
        try {
            if (!this.recommendationModel) {
                throw new Error('Recommendation model not loaded');
            }

            const recommendations = [];
            
            for (const course of availableCourses) {
                // Create feature vector
                const features = this.createUserCourseFeatures(userId, course, userHistory);
                const tensor = tf.tensor2d([features]);
                
                // Predict rating
                const prediction = this.recommendationModel.predict(tensor);
                const rating = prediction.dataSync()[0];
                
                recommendations.push({
                    courseId: course.id,
                    courseName: course.name,
                    predictedRating: rating,
                    confidence: rating
                });
                
                tensor.dispose();
                prediction.dispose();
            }

            // Sort by predicted rating
            recommendations.sort((a, b) => b.predictedRating - a.predictedRating);
            
            return recommendations.slice(0, 10); // Top 10 recommendations
        } catch (error) {
            console.error('❌ Recommendation failed:', error);
            throw error;
        }
    }

    /**
     * Create user-course feature vector
     */
    createUserCourseFeatures(userId, course, userHistory) {
        const features = [];
        
        // User features
        features.push(userHistory.totalCourses || 0);
        features.push(userHistory.averageGrade || 0);
        features.push(userHistory.studyTime || 0);
        features.push(userHistory.preferredCategories.indexOf(course.category) !== -1 ? 1 : 0);
        
        // Course features
        features.push(course.difficulty || 0);
        features.push(course.duration || 0);
        features.push(course.rating || 0);
        features.push(course.enrollmentCount || 0);
        
        // Interaction features
        features.push(userHistory.coursesCompleted.includes(course.id) ? 1 : 0);
        features.push(userHistory.coursesInProgress.includes(course.id) ? 1 : 0);
        
        return features;
    }

    /**
     * Predict learning outcome
     */
    async predictLearningOutcome(studentData) {
        try {
            if (!this.predictiveModel) {
                throw new Error('Predictive model not loaded');
            }

            const features = this.createStudentFeatures(studentData);
            const tensor = tf.tensor2d([features]);
            
            const prediction = this.predictiveModel.predict(tensor);
            const outcome = prediction.dataSync()[0];
            
            tensor.dispose();
            prediction.dispose();
            
            return {
                successProbability: outcome,
                recommendation: this.getOutcomeRecommendation(outcome)
            };
        } catch (error) {
            console.error('❌ Prediction failed:', error);
            throw error;
        }
    }

    /**
     * Create student feature vector
     */
    createStudentFeatures(studentData) {
        return [
            studentData.attendanceRate || 0,
            studentData.assignmentScore || 0,
            studentData.quizScore || 0,
            studentData.participationScore || 0,
            studentData.studyTime || 0,
            studentData.previousGrades || 0,
            studentData.courseDifficulty || 0,
            studentData.teacherRating || 0,
            studentData.peerInteraction || 0,
            studentData.technologyUsage || 0
        ];
    }

    /**
     * Get outcome recommendation
     */
    getOutcomeRecommendation(probability) {
        if (probability >= 0.8) {
            return "Excellent progress! Keep up the great work.";
        } else if (probability >= 0.6) {
            return "Good progress. Consider additional practice.";
        } else if (probability >= 0.4) {
            return "Needs improvement. Focus on weak areas.";
        } else {
            return "Requires immediate attention. Consider tutoring.";
        }
    }

    /**
     * Analyze learning patterns
     */
    analyzeLearningPatterns(studentData) {
        const patterns = {
            studyTimePattern: this.analyzeStudyTimePattern(studentData.studySessions),
            performanceTrend: this.analyzePerformanceTrend(studentData.grades),
            engagementLevel: this.calculateEngagementLevel(studentData),
            learningStyle: this.detectLearningStyle(studentData),
            riskFactors: this.identifyRiskFactors(studentData)
        };
        
        return patterns;
    }

    /**
     * Analyze study time pattern
     */
    analyzeStudyTimePattern(studySessions) {
        if (!studySessions || studySessions.length === 0) {
            return { pattern: 'unknown', recommendation: 'Start tracking study time' };
        }

        const totalTime = studySessions.reduce((sum, session) => sum + session.duration, 0);
        const averageTime = totalTime / studySessions.length;
        const consistency = this.calculateConsistency(studySessions.map(s => s.duration));

        return {
            totalTime: totalTime,
            averageTime: averageTime,
            consistency: consistency,
            pattern: consistency > 0.7 ? 'consistent' : 'irregular',
            recommendation: consistency > 0.7 ? 'Maintain consistent study schedule' : 'Establish regular study routine'
        };
    }

    /**
     * Analyze performance trend
     */
    analyzePerformanceTrend(grades) {
        if (!grades || grades.length < 2) {
            return { trend: 'insufficient_data', recommendation: 'Need more data points' };
        }

        const recentGrades = grades.slice(-5); // Last 5 grades
        const trend = this.calculateTrend(recentGrades);
        
        return {
            trend: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable',
            slope: trend,
            recommendation: this.getTrendRecommendation(trend)
        };
    }

    /**
     * Calculate engagement level
     */
    calculateEngagementLevel(studentData) {
        const factors = [
            studentData.participationRate || 0,
            studentData.assignmentCompletionRate || 0,
            studentData.discussionParticipation || 0,
            studentData.helpSeekingBehavior || 0,
            studentData.peerInteraction || 0
        ];

        const engagement = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
        
        return {
            level: engagement >= 0.8 ? 'high' : engagement >= 0.6 ? 'medium' : 'low',
            score: engagement,
            recommendation: this.getEngagementRecommendation(engagement)
        };
    }

    /**
     * Detect learning style
     */
    detectLearningStyle(studentData) {
        const visual = studentData.visualLearningScore || 0;
        const auditory = studentData.auditoryLearningScore || 0;
        const kinesthetic = studentData.kinestheticLearningScore || 0;

        const max = Math.max(visual, auditory, kinesthetic);
        
        if (max === visual) {
            return { style: 'visual', confidence: visual, recommendation: 'Use diagrams, charts, and visual aids' };
        } else if (max === auditory) {
            return { style: 'auditory', confidence: auditory, recommendation: 'Listen to lectures and discuss concepts' };
        } else {
            return { style: 'kinesthetic', confidence: kinesthetic, recommendation: 'Use hands-on activities and experiments' };
        }
    }

    /**
     * Identify risk factors
     */
    identifyRiskFactors(studentData) {
        const risks = [];
        
        if (studentData.attendanceRate < 0.8) {
            risks.push({ factor: 'low_attendance', severity: 'high', recommendation: 'Improve attendance' });
        }
        
        if (studentData.assignmentScore < 0.6) {
            risks.push({ factor: 'low_assignment_score', severity: 'medium', recommendation: 'Focus on assignments' });
        }
        
        if (studentData.quizScore < 0.6) {
            risks.push({ factor: 'low_quiz_score', severity: 'medium', recommendation: 'Review quiz materials' });
        }
        
        if (studentData.studyTime < 5) {
            risks.push({ factor: 'insufficient_study_time', severity: 'low', recommendation: 'Increase study time' });
        }

        return risks;
    }

    /**
     * Calculate consistency
     */
    calculateConsistency(values) {
        if (values.length < 2) return 0;
        
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        
        return Math.max(0, 1 - (stdDev / mean));
    }

    /**
     * Calculate trend
     */
    calculateTrend(values) {
        if (values.length < 2) return 0;
        
        const n = values.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = values;
        
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope;
    }

    /**
     * Get trend recommendation
     */
    getTrendRecommendation(trend) {
        if (trend > 0.1) {
            return "Performance is improving. Continue current strategies.";
        } else if (trend < -0.1) {
            return "Performance is declining. Review study methods.";
        } else {
            return "Performance is stable. Consider new challenges.";
        }
    }

    /**
     * Get engagement recommendation
     */
    getEngagementRecommendation(engagement) {
        if (engagement >= 0.8) {
            return "Excellent engagement! Keep participating actively.";
        } else if (engagement >= 0.6) {
            return "Good engagement. Try to participate more in discussions.";
        } else {
            return "Low engagement. Consider reaching out for help or support.";
        }
    }

    /**
     * Train model with new data
     */
    async trainModel(modelName, trainingData) {
        try {
            const model = this.models.get(modelName);
            if (!model) {
                throw new Error(`Model ${modelName} not found`);
            }

            const { xs, ys } = this.prepareTrainingData(trainingData);
            
            const history = await model.fit(xs, ys, {
                epochs: 10,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    }
                }
            });

            xs.dispose();
            ys.dispose();

            return history;
        } catch (error) {
            console.error(`❌ Failed to train model ${modelName}:`, error);
            throw error;
        }
    }

    /**
     * Prepare training data
     */
    prepareTrainingData(data) {
        const features = data.map(item => item.features);
        const labels = data.map(item => item.label);
        
        const xs = tf.tensor2d(features);
        const ys = tf.tensor2d(labels);
        
        return { xs, ys };
    }

    /**
     * Get model status
     */
    getModelStatus() {
        return {
            isInitialized: this.isInitialized,
            isLoading: this.isLoading,
            models: Array.from(this.models.keys()),
            backend: tf.getBackend()
        };
    }

    /**
     * Dispose models
     */
    dispose() {
        this.models.forEach(model => {
            if (model && typeof model.dispose === 'function') {
                model.dispose();
            }
        });
        this.models.clear();
    }
}

// Export for use in other modules
window.MLManager = MLManager;

