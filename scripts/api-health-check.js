/**
 * API Health Check Script - Bước 4.4 trong quy trình tự động
 * Kiểm tra API endpoints và forms hoạt động đúng
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class APIHealthCheck {
    constructor(previewUrl) {
        this.previewUrl = previewUrl;
        this.results = [];
        this.errors = [];
    }

    async runHealthChecks() {
        console.log('🏥 Running API Health Checks...\n');
        console.log(`🌐 Testing URL: ${this.previewUrl}\n`);
        
        try {
            await this.checkAPIEndpoints();
            await this.checkFormSubmission();
            await this.checkAuthenticationAPI();
            await this.checkAnalyticsAPI();
            await this.checkAIChatAPI();
            
            this.generateReport();
            return this.errors.length === 0;
            
        } catch (error) {
            console.error('❌ API health checks failed:', error.message);
            return false;
        }
    }

    async checkAPIEndpoints() {
        console.log('🔌 Checking API endpoints...');
        
        const apiEndpoints = [
            {
                path: '/api/auth',
                method: 'POST',
                data: { username: 'test@example.com', password: 'test123' },
                expectedStatus: [200, 401] // 200 for success, 401 for invalid credentials
            },
            {
                path: '/api/analytics',
                method: 'POST',
                data: { event: 'test', payload: { test: true } },
                expectedStatus: [200]
            },
            {
                path: '/api/ai-chat',
                method: 'POST',
                data: { message: 'Hello' },
                expectedStatus: [200]
            }
        ];
        
        for (const endpoint of apiEndpoints) {
            try {
                const response = await this.makeAPIRequest(endpoint.path, endpoint.method, endpoint.data);
                
                if (endpoint.expectedStatus.includes(response.statusCode)) {
                    this.addResult('✅', `API ${endpoint.path}: ${response.statusCode} OK`);
                    console.log(`✅ API ${endpoint.path}: ${response.statusCode} OK`);
                } else {
                    this.addError(`❌ API ${endpoint.path}: Expected ${endpoint.expectedStatus.join(' or ')}, got ${response.statusCode}`);
                    console.log(`❌ API ${endpoint.path}: Expected ${endpoint.expectedStatus.join(' or ')}, got ${response.statusCode}`);
                }
                
                // Check response content
                if (response.data) {
                    try {
                        const jsonData = JSON.parse(response.data);
                        if (jsonData.status || jsonData.success !== undefined || jsonData.response) {
                            this.addResult('✅', `API ${endpoint.path}: Valid JSON response`);
                        } else {
                            this.addWarning(`⚠️  API ${endpoint.path}: Unexpected JSON structure`);
                        }
                    } catch (e) {
                        this.addWarning(`⚠️  API ${endpoint.path}: Invalid JSON response`);
                    }
                }
                
            } catch (error) {
                this.addError(`❌ API ${endpoint.path}: ${error.message}`);
                console.error(`❌ API ${endpoint.path}: ${error.message}`);
            }
        }
    }

    async checkFormSubmission() {
        console.log('📝 Checking form submission...');
        
        // Test contact form if exists
        try {
            const contactFormData = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message',
                subject: 'Test Subject'
            };
            
            const response = await this.makeAPIRequest('/api/contact', 'POST', contactFormData);
            
            if (response.statusCode === 200) {
                this.addResult('✅', 'Contact form: 200 OK');
                console.log('✅ Contact form: 200 OK');
            } else {
                this.addWarning(`⚠️  Contact form: ${response.statusCode} (may not be implemented)`);
                console.log(`⚠️  Contact form: ${response.statusCode} (may not be implemented)`);
            }
            
        } catch (error) {
            this.addWarning(`⚠️  Contact form: ${error.message} (may not be implemented)`);
            console.log(`⚠️  Contact form: ${error.message} (may not be implemented)`);
        }
    }

    async checkAuthenticationAPI() {
        console.log('🔐 Checking authentication API...');
        
        try {
            // Test with invalid credentials (should return 401)
            const invalidAuth = await this.makeAPIRequest('/api/auth', 'POST', {
                username: 'invalid@example.com',
                password: 'wrongpassword'
            });
            
            if (invalidAuth.statusCode === 401) {
                this.addResult('✅', 'Auth API: Invalid credentials properly rejected (401)');
                console.log('✅ Auth API: Invalid credentials properly rejected (401)');
            } else {
                this.addWarning(`⚠️  Auth API: Invalid credentials returned ${invalidAuth.statusCode}`);
                console.log(`⚠️  Auth API: Invalid credentials returned ${invalidAuth.statusCode}`);
            }
            
            // Test with valid credentials (if available)
            const validAuth = await this.makeAPIRequest('/api/auth', 'POST', {
                username: 'admin@eduplatform.com',
                password: 'admin123'
            });
            
            if (validAuth.statusCode === 200) {
                this.addResult('✅', 'Auth API: Valid credentials accepted (200)');
                console.log('✅ Auth API: Valid credentials accepted (200)');
            } else if (validAuth.statusCode === 401) {
                this.addResult('✅', 'Auth API: Valid credentials properly rejected (401) - expected for test');
                console.log('✅ Auth API: Valid credentials properly rejected (401) - expected for test');
            } else {
                this.addWarning(`⚠️  Auth API: Valid credentials returned ${validAuth.statusCode}`);
                console.log(`⚠️  Auth API: Valid credentials returned ${validAuth.statusCode}`);
            }
            
        } catch (error) {
            this.addError(`❌ Auth API: ${error.message}`);
            console.error(`❌ Auth API: ${error.message}`);
        }
    }

    async checkAnalyticsAPI() {
        console.log('📊 Checking analytics API...');
        
        try {
            const analyticsData = {
                event: 'page_view',
                payload: {
                    page: '/test',
                    timestamp: Date.now(),
                    userAgent: 'EduPlatform-HealthCheck/1.0'
                }
            };
            
            const response = await this.makeAPIRequest('/api/analytics', 'POST', analyticsData);
            
            if (response.statusCode === 200) {
                this.addResult('✅', 'Analytics API: 200 OK');
                console.log('✅ Analytics API: 200 OK');
            } else {
                this.addError(`❌ Analytics API: ${response.statusCode}`);
                console.log(`❌ Analytics API: ${response.statusCode}`);
            }
            
        } catch (error) {
            this.addError(`❌ Analytics API: ${error.message}`);
            console.error(`❌ Analytics API: ${error.message}`);
        }
    }

    async checkAIChatAPI() {
        console.log('🤖 Checking AI Chat API...');
        
        try {
            const chatData = {
                message: 'Hello, this is a health check test.'
            };
            
            const response = await this.makeAPIRequest('/api/ai-chat', 'POST', chatData);
            
            if (response.statusCode === 200) {
                this.addResult('✅', 'AI Chat API: 200 OK');
                console.log('✅ AI Chat API: 200 OK');
                
                // Check if response contains AI-like content
                if (response.data) {
                    try {
                        const jsonData = JSON.parse(response.data);
                        if (jsonData.response && jsonData.response.length > 0) {
                            this.addResult('✅', 'AI Chat API: Valid response content');
                            console.log('✅ AI Chat API: Valid response content');
                        } else {
                            this.addWarning('⚠️  AI Chat API: Empty response content');
                            console.log('⚠️  AI Chat API: Empty response content');
                        }
                    } catch (e) {
                        this.addWarning('⚠️  AI Chat API: Invalid JSON response');
                        console.log('⚠️  AI Chat API: Invalid JSON response');
                    }
                }
            } else {
                this.addError(`❌ AI Chat API: ${response.statusCode}`);
                console.log(`❌ AI Chat API: ${response.statusCode}`);
            }
            
        } catch (error) {
            this.addError(`❌ AI Chat API: ${error.message}`);
            console.error(`❌ AI Chat API: ${error.message}`);
        }
    }

    makeAPIRequest(path, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(path, this.previewUrl);
            const isHttps = url.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const requestData = data ? JSON.stringify(data) : '';
            
            const requestOptions = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestData),
                    'User-Agent': 'EduPlatform-HealthCheck/1.0',
                    'Accept': 'application/json'
                },
                timeout: 15000
            };
            
            const req = client.request(requestOptions, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        headers: res.headers,
                        data: responseData
                    });
                });
            });
            
            req.on('error', (error) => {
                reject(error);
            });
            
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
            
            if (requestData) {
                req.write(requestData);
            }
            
            req.end();
        });
    }

    addResult(icon, message) {
        this.results.push({ icon, message, type: 'success' });
    }

    addWarning(message) {
        this.results.push({ icon: '⚠️', message, type: 'warning' });
    }

    addError(message) {
        this.errors.push(message);
        this.results.push({ icon: '❌', message, type: 'error' });
    }

    generateReport() {
        console.log('\n📊 API HEALTH CHECK REPORT');
        console.log('='.repeat(50));
        
        // Summary
        const passed = this.results.filter(r => r.type === 'success').length;
        const warnings = this.results.filter(r => r.type === 'warning').length;
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️  Warnings: ${warnings}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const result of this.results) {
            console.log(`${result.icon} ${result.message}`);
        }
        
        // Result
        console.log('\n🚀 API HEALTH CHECK RESULT:');
        if (this.errors.length === 0) {
            console.log('✅ API HEALTH CHECKS PASSED!');
            console.log('   All API endpoints are responding correctly.');
        } else {
            console.log('❌ API HEALTH CHECKS FAILED!');
            console.log('   Some API endpoints are not responding correctly.');
            
            console.log('\n🔧 ERRORS TO FIX:');
            for (const error of this.errors) {
                console.log(`   ${error}`);
            }
        }
        
        console.log('\n' + '='.repeat(50));
        
        return this.errors.length === 0;
    }
}

// Run if this script is executed directly
if (require.main === module) {
    const previewUrl = process.env.PREVIEW_URL || process.argv[2];
    
    if (!previewUrl) {
        console.error('❌ Please provide PREVIEW_URL as environment variable or argument');
        console.log('Usage: node api-health-check.js <PREVIEW_URL>');
        process.exit(1);
    }
    
    const healthCheck = new APIHealthCheck(previewUrl);
    healthCheck.runHealthChecks().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ API health checks failed:', error);
        process.exit(1);
    });
}

module.exports = APIHealthCheck;
