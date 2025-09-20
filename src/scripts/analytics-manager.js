/**
 * Advanced Analytics Manager with Chart.js
 * Handles data visualization, learning analytics, and performance tracking
 */

class AnalyticsManager {
    constructor() {
        this.charts = new Map();
        this.data = {
            students: [],
            courses: [],
            quizzes: [],
            assignments: [],
            progress: [],
            engagement: [],
            performance: []
        };
        this.filters = {
            dateRange: { start: null, end: null },
            course: null,
            student: null,
            category: null
        };
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * Initialize Analytics Manager
     */
    init() {
        try {
            // Check if Chart.js is available
            if (typeof Chart === 'undefined') {
                console.error('❌ Chart.js not loaded');
                return;
            }

            // Load sample data
            this.loadSampleData();
            
            this.isInitialized = true;
            console.log('✅ Analytics Manager initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Analytics Manager:', error);
        }
    }

    /**
     * Load sample data
     */
    loadSampleData() {
        // Sample student data
        this.data.students = [
            { id: 1, name: 'John Doe', email: 'john@example.com', enrollmentDate: '2024-01-15', status: 'active' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrollmentDate: '2024-02-01', status: 'active' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', enrollmentDate: '2024-01-20', status: 'completed' },
            { id: 4, name: 'Alice Brown', email: 'alice@example.com', enrollmentDate: '2024-02-10', status: 'active' },
            { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', enrollmentDate: '2024-01-25', status: 'inactive' }
        ];

        // Sample course data
        this.data.courses = [
            { id: 1, name: 'JavaScript Fundamentals', category: 'Programming', duration: 40, difficulty: 'Beginner', students: 150 },
            { id: 2, name: 'Advanced React', category: 'Programming', duration: 60, difficulty: 'Intermediate', students: 80 },
            { id: 3, name: 'Data Science Basics', category: 'Data Science', duration: 50, difficulty: 'Beginner', students: 120 },
            { id: 4, name: 'Machine Learning', category: 'AI/ML', duration: 80, difficulty: 'Advanced', students: 60 },
            { id: 5, name: 'Web Design', category: 'Design', duration: 30, difficulty: 'Beginner', students: 200 }
        ];

        // Sample quiz data
        this.data.quizzes = [
            { id: 1, courseId: 1, name: 'Variables and Functions', averageScore: 85, attempts: 120, date: '2024-02-15' },
            { id: 2, courseId: 1, name: 'Objects and Arrays', averageScore: 78, attempts: 115, date: '2024-02-20' },
            { id: 3, courseId: 2, name: 'React Components', averageScore: 82, attempts: 70, date: '2024-02-18' },
            { id: 4, courseId: 3, name: 'Data Visualization', averageScore: 75, attempts: 100, date: '2024-02-22' },
            { id: 5, courseId: 4, name: 'Neural Networks', averageScore: 68, attempts: 45, date: '2024-02-25' }
        ];

        // Sample progress data
        this.data.progress = [
            { studentId: 1, courseId: 1, progress: 85, lastAccessed: '2024-02-25' },
            { studentId: 1, courseId: 2, progress: 60, lastAccessed: '2024-02-24' },
            { studentId: 2, courseId: 1, progress: 100, lastAccessed: '2024-02-25' },
            { studentId: 2, courseId: 3, progress: 45, lastAccessed: '2024-02-23' },
            { studentId: 3, courseId: 1, progress: 100, lastAccessed: '2024-02-20' },
            { studentId: 3, courseId: 2, progress: 100, lastAccessed: '2024-02-22' },
            { studentId: 4, courseId: 1, progress: 70, lastAccessed: '2024-02-25' },
            { studentId: 5, courseId: 1, progress: 30, lastAccessed: '2024-02-15' }
        ];

        // Sample engagement data
        this.data.engagement = [
            { date: '2024-02-19', activeUsers: 45, pageViews: 1200, sessionDuration: 25 },
            { date: '2024-02-20', activeUsers: 52, pageViews: 1350, sessionDuration: 28 },
            { date: '2024-02-21', activeUsers: 48, pageViews: 1280, sessionDuration: 26 },
            { date: '2024-02-22', activeUsers: 55, pageViews: 1420, sessionDuration: 30 },
            { date: '2024-02-23', activeUsers: 50, pageViews: 1380, sessionDuration: 27 },
            { date: '2024-02-24', activeUsers: 38, pageViews: 980, sessionDuration: 22 },
            { date: '2024-02-25', activeUsers: 42, pageViews: 1100, sessionDuration: 24 }
        ];

        // Sample performance data
        this.data.performance = [
            { courseId: 1, averageScore: 82, completionRate: 85, satisfaction: 4.2 },
            { courseId: 2, averageScore: 78, completionRate: 70, satisfaction: 4.0 },
            { courseId: 3, averageScore: 75, completionRate: 80, satisfaction: 3.8 },
            { courseId: 4, averageScore: 68, completionRate: 60, satisfaction: 3.5 },
            { courseId: 5, averageScore: 88, completionRate: 90, satisfaction: 4.5 }
        ];
    }

    /**
     * Create chart
     */
    createChart(canvasId, type, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas with id "${canvasId}" not found`);
            return null;
        }

        const ctx = canvas.getContext('2d');
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: options.title || ''
                }
            }
        };

        const chartOptions = { ...defaultOptions, ...options };

        const chart = new Chart(ctx, {
            type: type,
            data: data,
            options: chartOptions
        });

        this.charts.set(canvasId, chart);
        return chart;
    }

    /**
     * Create student enrollment chart
     */
    createStudentEnrollmentChart(canvasId) {
        const enrollmentData = this.getEnrollmentData();
        
        const data = {
            labels: enrollmentData.labels,
            datasets: [{
                label: 'New Enrollments',
                data: enrollmentData.values,
                backgroundColor: 'rgba(17, 115, 212, 0.8)',
                borderColor: 'rgba(17, 115, 212, 1)',
                borderWidth: 1
            }]
        };

        const options = {
            title: 'Student Enrollment Over Time',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return this.createChart(canvasId, 'line', data, options);
    }

    /**
     * Create course performance chart
     */
    createCoursePerformanceChart(canvasId) {
        const performanceData = this.getCoursePerformanceData();
        
        const data = {
            labels: performanceData.labels,
            datasets: [{
                label: 'Average Score',
                data: performanceData.scores,
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 1
            }, {
                label: 'Completion Rate (%)',
                data: performanceData.completionRates,
                backgroundColor: 'rgba(168, 85, 247, 0.8)',
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 1
            }]
        };

        const options = {
            title: 'Course Performance Metrics',
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        };

        return this.createChart(canvasId, 'bar', data, options);
    }

    /**
     * Create engagement heatmap
     */
    createEngagementHeatmap(canvasId) {
        const heatmapData = this.getEngagementHeatmapData();
        
        const data = {
            labels: heatmapData.labels,
            datasets: [{
                label: 'Active Users',
                data: heatmapData.values,
                backgroundColor: heatmapData.colors,
                borderColor: 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1
            }]
        };

        const options = {
            title: 'Daily Engagement Heatmap',
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        };

        return this.createChart(canvasId, 'bar', data, options);
    }

    /**
     * Create learning path analytics
     */
    createLearningPathChart(canvasId) {
        const pathData = this.getLearningPathData();
        
        const data = {
            labels: pathData.labels,
            datasets: [{
                label: 'Students',
                data: pathData.values,
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: 'rgba(249, 115, 22, 1)',
                borderWidth: 1
            }]
        };

        const options = {
            title: 'Learning Path Progression',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return this.createChart(canvasId, 'doughnut', data, options);
    }

    /**
     * Create quiz performance chart
     */
    createQuizPerformanceChart(canvasId) {
        const quizData = this.getQuizPerformanceData();
        
        const data = {
            labels: quizData.labels,
            datasets: [{
                label: 'Average Score',
                data: quizData.scores,
                backgroundColor: 'rgba(236, 72, 153, 0.8)',
                borderColor: 'rgba(236, 72, 153, 1)',
                borderWidth: 1
            }]
        };

        const options = {
            title: 'Quiz Performance Trends',
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        };

        return this.createChart(canvasId, 'line', data, options);
    }

    /**
     * Create student progress chart
     */
    createStudentProgressChart(canvasId, studentId) {
        const progressData = this.getStudentProgressData(studentId);
        
        const data = {
            labels: progressData.labels,
            datasets: [{
                label: 'Progress (%)',
                data: progressData.values,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                fill: true
            }]
        };

        const options = {
            title: 'Student Progress Over Time',
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        };

        return this.createChart(canvasId, 'line', data, options);
    }

    /**
     * Create category distribution chart
     */
    createCategoryDistributionChart(canvasId) {
        const categoryData = this.getCategoryDistributionData();
        
        const data = {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: [
                    'rgba(17, 115, 212, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(236, 72, 153, 0.8)'
                ],
                borderColor: [
                    'rgba(17, 115, 212, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 1
            }]
        };

        const options = {
            title: 'Course Category Distribution'
        };

        return this.createChart(canvasId, 'pie', data, options);
    }

    /**
     * Get enrollment data
     */
    getEnrollmentData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const enrollments = [15, 23, 18, 31, 25, 28];
        
        return {
            labels: months,
            values: enrollments
        };
    }

    /**
     * Get course performance data
     */
    getCoursePerformanceData() {
        const courses = this.data.courses.map(course => course.name);
        const scores = this.data.performance.map(perf => perf.averageScore);
        const completionRates = this.data.performance.map(perf => perf.completionRate);
        
        return {
            labels: courses,
            scores: scores,
            completionRates: completionRates
        };
    }

    /**
     * Get engagement heatmap data
     */
    getEngagementHeatmapData() {
        const labels = this.data.engagement.map(day => day.date);
        const values = this.data.engagement.map(day => day.activeUsers);
        const colors = values.map(value => {
            const intensity = value / Math.max(...values);
            return `rgba(17, 115, 212, ${intensity})`;
        });
        
        return {
            labels: labels,
            values: values,
            colors: colors
        };
    }

    /**
     * Get learning path data
     */
    getLearningPathData() {
        const paths = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        const students = [45, 32, 18, 8];
        
        return {
            labels: paths,
            values: students
        };
    }

    /**
     * Get quiz performance data
     */
    getQuizPerformanceData() {
        const quizzes = this.data.quizzes.map(quiz => quiz.name);
        const scores = this.data.quizzes.map(quiz => quiz.averageScore);
        
        return {
            labels: quizzes,
            scores: scores
        };
    }

    /**
     * Get student progress data
     */
    getStudentProgressData(studentId) {
        const studentProgress = this.data.progress.filter(p => p.studentId === studentId);
        const labels = studentProgress.map(p => this.data.courses.find(c => c.id === p.courseId)?.name || 'Unknown');
        const values = studentProgress.map(p => p.progress);
        
        return {
            labels: labels,
            values: values
        };
    }

    /**
     * Get category distribution data
     */
    getCategoryDistributionData() {
        const categories = [...new Set(this.data.courses.map(course => course.category))];
        const counts = categories.map(category => 
            this.data.courses.filter(course => course.category === category).length
        );
        
        return {
            labels: categories,
            values: counts
        };
    }

    /**
     * Update chart data
     */
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    }

    /**
     * Destroy chart
     */
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    /**
     * Export chart as image
     */
    exportChart(canvasId, format = 'png') {
        const chart = this.charts.get(canvasId);
        if (chart) {
            return chart.toBase64Image(format);
        }
        return null;
    }

    /**
     * Get analytics summary
     */
    getAnalyticsSummary() {
        const totalStudents = this.data.students.length;
        const activeStudents = this.data.students.filter(s => s.status === 'active').length;
        const totalCourses = this.data.courses.length;
        const averageQuizScore = this.data.quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / this.data.quizzes.length;
        const totalEngagement = this.data.engagement.reduce((sum, day) => sum + day.activeUsers, 0);
        
        return {
            totalStudents,
            activeStudents,
            totalCourses,
            averageQuizScore: Math.round(averageQuizScore),
            totalEngagement,
            completionRate: this.calculateOverallCompletionRate()
        };
    }

    /**
     * Calculate overall completion rate
     */
    calculateOverallCompletionRate() {
        const totalProgress = this.data.progress.length;
        const completedProgress = this.data.progress.filter(p => p.progress === 100).length;
        return totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;
    }

    /**
     * Apply filters
     */
    applyFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.refreshAllCharts();
    }

    /**
     * Refresh all charts
     */
    refreshAllCharts() {
        this.charts.forEach((chart, canvasId) => {
            // Update chart data based on current filters
            // This would involve recalculating data based on filters
            chart.update();
        });
    }

    /**
     * Get filtered data
     */
    getFilteredData(dataType) {
        let data = this.data[dataType] || [];
        
        // Apply date range filter
        if (this.filters.dateRange.start && this.filters.dateRange.end) {
            data = data.filter(item => {
                const itemDate = new Date(item.date || item.enrollmentDate || item.lastAccessed);
                return itemDate >= this.filters.dateRange.start && itemDate <= this.filters.dateRange.end;
            });
        }
        
        // Apply course filter
        if (this.filters.course) {
            data = data.filter(item => item.courseId === this.filters.course);
        }
        
        // Apply student filter
        if (this.filters.student) {
            data = data.filter(item => item.studentId === this.filters.student);
        }
        
        // Apply category filter
        if (this.filters.category) {
            data = data.filter(item => item.category === this.filters.category);
        }
        
        return data;
    }

    /**
     * Get chart status
     */
    getChartStatus() {
        return {
            isInitialized: this.isInitialized,
            chartsCount: this.charts.size,
            chartIds: Array.from(this.charts.keys())
        };
    }

    /**
     * Dispose all charts
     */
    dispose() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }
}

// Export for use in other modules
window.AnalyticsManager = AnalyticsManager;

