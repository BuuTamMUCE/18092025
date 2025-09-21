/**
 * Smoke Tests Script - Bước 4.1 trong quy trình tự động
 * Thực hiện: curl -I $PREVIEW_URL
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

class SmokeTests {
    constructor(previewUrl) {
        this.previewUrl = previewUrl;
        this.results = [];
        this.errors = [];
    }

    async runSmokeTests() {
        console.log('🔥 Running Smoke Tests...\n');
        console.log(`🌐 Testing URL: ${this.previewUrl}\n`);
        
        try {
            await this.checkHomepage();
            await this.checkAssets();
            await this.checkAPIEndpoints();
            await this.checkRedirects();
            
            this.generateReport();
            return this.errors.length === 0;
            
        } catch (error) {
            console.error('❌ Smoke tests failed:', error.message);
            return false;
        }
    }

    async checkHomepage() {
        console.log('🏠 Checking homepage...');
        
        try {
            const response = await this.makeRequest(this.previewUrl);
            
            if (response.statusCode === 200) {
                this.addResult('✅', `Homepage: ${response.statusCode} OK`);
                console.log(`✅ Homepage: ${response.statusCode} OK`);
            } else {
                this.addError(`❌ Homepage: ${response.statusCode} ${response.statusMessage}`);
                console.log(`❌ Homepage: ${response.statusCode} ${response.statusMessage}`);
            }
            
        } catch (error) {
            this.addError(`❌ Homepage check failed: ${error.message}`);
            console.error(`❌ Homepage check failed: ${error.message}`);
        }
    }

    async checkAssets() {
        console.log('📁 Checking critical assets...');
        
        const criticalAssets = [
            '/robots.txt',
            '/sitemap.xml',
            '/site.webmanifest',
            '/scripts/navigation.js',
            '/scripts/i18n.js',
            '/styles/i18n.css'
        ];
        
        for (const asset of criticalAssets) {
            try {
                const assetUrl = new URL(asset, this.previewUrl).href;
                const response = await this.makeRequest(assetUrl);
                
                if (response.statusCode === 200) {
                    this.addResult('✅', `Asset ${asset}: ${response.statusCode} OK`);
                } else {
                    this.addError(`❌ Asset ${asset}: ${response.statusCode}`);
                    console.log(`❌ Asset ${asset}: ${response.statusCode}`);
                }
                
            } catch (error) {
                this.addError(`❌ Asset ${asset}: ${error.message}`);
                console.error(`❌ Asset ${asset}: ${error.message}`);
            }
        }
    }

    async checkAPIEndpoints() {
        console.log('🔌 Checking API endpoints...');
        
        const apiEndpoints = [
            '/api/auth',
            '/api/analytics',
            '/api/ai-chat'
        ];
        
        for (const endpoint of apiEndpoints) {
            try {
                const apiUrl = new URL(endpoint, this.previewUrl).href;
                const response = await this.makeRequest(apiUrl, { method: 'POST' });
                
                // API endpoints should return 200 or 405 (Method Not Allowed)
                if (response.statusCode === 200 || response.statusCode === 405) {
                    this.addResult('✅', `API ${endpoint}: ${response.statusCode} OK`);
                } else {
                    this.addError(`❌ API ${endpoint}: ${response.statusCode}`);
                    console.log(`❌ API ${endpoint}: ${response.statusCode}`);
                }
                
            } catch (error) {
                this.addError(`❌ API ${endpoint}: ${error.message}`);
                console.error(`❌ API ${endpoint}: ${error.message}`);
            }
        }
    }

    async checkRedirects() {
        console.log('🔄 Checking redirects...');
        
        const redirectTests = [
            { from: '/admin', expected: 302 },
            { from: '/student', expected: 302 },
            { from: '/dashboard', expected: 302 },
            { from: '/courses', expected: 302 },
            { from: '/quiz', expected: 302 }
        ];
        
        for (const test of redirectTests) {
            try {
                const redirectUrl = new URL(test.from, this.previewUrl).href;
                const response = await this.makeRequest(redirectUrl);
                
                if (response.statusCode === test.expected) {
                    this.addResult('✅', `Redirect ${test.from}: ${response.statusCode} OK`);
                } else {
                    this.addError(`❌ Redirect ${test.from}: Expected ${test.expected}, got ${response.statusCode}`);
                    console.log(`❌ Redirect ${test.from}: Expected ${test.expected}, got ${response.statusCode}`);
                }
                
            } catch (error) {
                this.addError(`❌ Redirect ${test.from}: ${error.message}`);
                console.error(`❌ Redirect ${test.from}: ${error.message}`);
            }
        }
    }

    makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const requestOptions = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: options.method || 'GET',
                headers: {
                    'User-Agent': 'EduPlatform-Smoke-Test/1.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                },
                timeout: 10000
            };
            
            const req = client.request(requestOptions, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        headers: res.headers,
                        data: data
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
            
            req.end();
        });
    }

    addResult(icon, message) {
        this.results.push({ icon, message, type: 'success' });
    }

    addError(message) {
        this.errors.push(message);
        this.results.push({ icon: '❌', message, type: 'error' });
    }

    generateReport() {
        console.log('\n📊 SMOKE TESTS REPORT');
        console.log('='.repeat(50));
        
        // Summary
        const passed = this.results.filter(r => r.type === 'success').length;
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const result of this.results) {
            console.log(`${result.icon} ${result.message}`);
        }
        
        // Result
        console.log('\n🚀 SMOKE TESTS RESULT:');
        if (this.errors.length === 0) {
            console.log('✅ SMOKE TESTS PASSED!');
            console.log('   All critical endpoints are responding correctly.');
        } else {
            console.log('❌ SMOKE TESTS FAILED!');
            console.log('   Some endpoints are not responding correctly.');
            
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
        console.log('Usage: node smoke-tests.js <PREVIEW_URL>');
        process.exit(1);
    }
    
    const smokeTests = new SmokeTests(previewUrl);
    smokeTests.runSmokeTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Smoke tests failed:', error);
        process.exit(1);
    });
}

module.exports = SmokeTests;

