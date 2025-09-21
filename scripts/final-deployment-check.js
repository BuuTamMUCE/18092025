/**
 * Final Deployment Check - Simplified and Accurate
 */

const fs = require('fs');
const path = require('path');

class FinalDeploymentChecker {
    constructor() {
        this.publicPath = path.join(__dirname, '..', 'public');
        this.checks = [];
        this.errors = [];
        this.warnings = [];
    }

    async runFinalCheck() {
        console.log('🚀 Final Deployment Check - EduPlatform LMS\n');
        
        await this.checkEssentialFiles();
        await this.checkNavigation();
        await this.checkSEO();
        await this.checkSecurity();
        await this.checkPerformance();
        await this.checkInternationalization();
        
        this.generateFinalReport();
    }

    async checkEssentialFiles() {
        console.log('📁 Checking Essential Files...');
        
        const essentialFiles = [
            'index.html',
            'robots.txt', 
            'sitemap.xml',
            'site.webmanifest'
        ];
        
        for (const file of essentialFiles) {
            const filePath = path.join(this.publicPath, file);
            if (fs.existsSync(filePath)) {
                this.addCheck('✅', `${file} exists`);
            } else {
                this.addError(`❌ Missing essential file: ${file}`);
            }
        }
        
        // Check directories
        const essentialDirs = ['scripts', 'styles', 'locales'];
        for (const dir of essentialDirs) {
            const dirPath = path.join(this.publicPath, dir);
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath);
                this.addCheck('✅', `${dir}/ directory exists with ${files.length} files`);
            } else {
                this.addError(`❌ Missing directory: ${dir}/`);
            }
        }
    }

    async checkNavigation() {
        console.log('🔗 Checking Navigation...');
        
        const indexPath = path.join(this.publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            
            // Check for navigation script
            if (content.includes('navigation.js')) {
                this.addCheck('✅', 'Navigation script included');
            } else {
                this.addError('❌ Navigation script missing');
            }
            
            // Check for navigation links
            const navLinks = content.match(/navigationManager\.navigateTo\(['"]([^'"]+)['"]\)/g);
            if (navLinks) {
                this.addCheck('✅', `Found ${navLinks.length} navigation links`);
                
                // Check if target pages exist
                const pageMap = {
                    'adminLogin': 'admin-login.html',
                    'adminDashboard': 'admin-dashboard.html',
                    'studentLogin': 'student-login.html',
                    'studentDashboard': 'student-dashboard.html',
                    'courseManagement': 'course-management.html',
                    'coursePlayer': 'course-player.html',
                    'quizManagement': 'quiz-management.html',
                    'quizInterface': 'quiz-interface.html',
                    'orderManagement': 'order-management.html',
                    'adminStudentManagement': 'admin-student-management.html',
                    'studentProfile': 'student-profile.html'
                };
                
                let workingLinks = 0;
                for (const link of navLinks) {
                    const match = link.match(/navigationManager\.navigateTo\(['"]([^'"]+)['"]\)/);
                    if (match) {
                        const routeName = match[1];
                        const targetFile = pageMap[routeName];
                        if (targetFile) {
                            const targetPath = path.join(this.publicPath, targetFile);
                            if (fs.existsSync(targetPath)) {
                                workingLinks++;
                            }
                        }
                    }
                }
                
                if (workingLinks === navLinks.length) {
                    this.addCheck('✅', 'All navigation links point to existing pages');
                } else {
                    this.addWarning(`⚠️  ${workingLinks}/${navLinks.length} navigation links working`);
                }
            } else {
                this.addError('❌ No navigation links found');
            }
        }
    }

    async checkSEO() {
        console.log('🔍 Checking SEO...');
        
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html') && !['404.html', '500.html', 'offline.html', 'page-redirect.html'].includes(file));
        
        let goodSEOPages = 0;
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const seoElements = [
                /<title>.*?<\/title>/i,
                /<meta name="description"/i,
                /<meta name="keywords"/i,
                /<meta property="og:title"/i,
                /<meta property="og:description"/i,
                /<meta property="twitter:title"/i
            ];
            
            const seoScore = seoElements.reduce((score, pattern) => {
                return score + (pattern.test(content) ? 1 : 0);
            }, 0);
            
            if (seoScore >= 4) {
                goodSEOPages++;
            }
        }
        
        if (goodSEOPages === htmlFiles.length) {
            this.addCheck('✅', `All ${htmlFiles.length} pages have good SEO`);
        } else {
            this.addWarning(`⚠️  ${goodSEOPages}/${htmlFiles.length} pages have good SEO`);
        }
        
        // Check sitemap
        const sitemapPath = path.join(this.publicPath, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            if (content.includes('<urlset') && !content.includes('yourdomain.com')) {
                this.addCheck('✅', 'Sitemap is properly configured');
            } else {
                this.addWarning('⚠️  Sitemap needs domain update');
            }
        }
    }

    async checkSecurity() {
        console.log('🔒 Checking Security...');
        
        // Check vercel.json for security headers
        const vercelPath = path.join(__dirname, '..', 'vercel.json');
        if (fs.existsSync(vercelPath)) {
            const content = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
            
            if (content.headers) {
                const securityHeaders = [
                    'X-Content-Type-Options',
                    'X-Frame-Options', 
                    'X-XSS-Protection',
                    'Strict-Transport-Security',
                    'Content-Security-Policy'
                ];
                
                let securityScore = 0;
                for (const header of securityHeaders) {
                    if (content.headers.some(h => 
                        h.headers && h.headers.some(hdr => hdr.key === header)
                    )) {
                        securityScore++;
                    }
                }
                
                if (securityScore >= 4) {
                    this.addCheck('✅', `Good security headers (${securityScore}/${securityHeaders.length})`);
                } else {
                    this.addWarning(`⚠️  Security headers need improvement (${securityScore}/${securityHeaders.length})`);
                }
            }
        }
        
        // Check for sensitive information
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        let sensitiveFiles = 0;
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            if (content.match(/password\s*[:=]\s*["'][^"']+["']/i) ||
                content.match(/api[_-]?key\s*[:=]\s*["'][^"']+["']/i) ||
                content.match(/secret\s*[:=]\s*["'][^"']+["']/i)) {
                sensitiveFiles++;
            }
        }
        
        if (sensitiveFiles === 0) {
            this.addCheck('✅', 'No sensitive information found in HTML files');
        } else {
            this.addWarning(`⚠️  ${sensitiveFiles} files may contain sensitive information`);
        }
    }

    async checkPerformance() {
        console.log('⚡ Checking Performance...');
        
        const indexPath = path.join(this.publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            
            const perfChecks = [
                { name: 'Preconnect links', pattern: /<link[^>]*rel=["\']preconnect["\']/i },
                { name: 'External CSS optimization', pattern: /<link[^>]*rel=["\']stylesheet["\']/i },
                { name: 'Script optimization', pattern: /<script[^>]*defer/i }
            ];
            
            for (const check of perfChecks) {
                if (check.pattern.test(content)) {
                    this.addCheck('✅', `Performance: ${check.name} implemented`);
                }
            }
        }
        
        // Check file sizes
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        let largeFiles = 0;
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const stats = fs.statSync(filePath);
            const sizeKB = Math.round(stats.size / 1024);
            
            if (sizeKB > 100) {
                largeFiles++;
            }
        }
        
        if (largeFiles === 0) {
            this.addCheck('✅', 'All HTML files are reasonably sized');
        } else {
            this.addWarning(`⚠️  ${largeFiles} HTML files are large (>100KB)`);
        }
    }

    async checkInternationalization() {
        console.log('🌍 Checking Internationalization...');
        
        // Check locales directory
        const localesPath = path.join(this.publicPath, 'locales');
        if (fs.existsSync(localesPath)) {
            const localeFiles = fs.readdirSync(localesPath)
                .filter(file => file.endsWith('.json'));
            
            if (localeFiles.length >= 3) {
                this.addCheck('✅', `Found ${localeFiles.length} language files`);
                
                // Check if all languages have translations
                const expectedLanguages = ['en', 'vi', 'zh'];
                let completeLanguages = 0;
                
                for (const lang of expectedLanguages) {
                    const langFile = path.join(localesPath, `${lang}.json`);
                    if (fs.existsSync(langFile)) {
                        try {
                            const content = JSON.parse(fs.readFileSync(langFile, 'utf8'));
                            if (Object.keys(content).length >= 50) {
                                completeLanguages++;
                            }
                        } catch (e) {
                            // Invalid JSON
                        }
                    }
                }
                
                if (completeLanguages === expectedLanguages.length) {
                    this.addCheck('✅', 'All language files have complete translations');
                } else {
                    this.addWarning(`⚠️  ${completeLanguages}/${expectedLanguages.length} languages have complete translations`);
                }
            } else {
                this.addWarning(`⚠️  Only ${localeFiles.length} language files found`);
            }
        } else {
            this.addError('❌ Missing locales directory');
        }
        
        // Check i18n script
        const i18nScript = path.join(this.publicPath, 'scripts', 'i18n.js');
        if (fs.existsSync(i18nScript)) {
            this.addCheck('✅', 'i18n.js script exists');
        } else {
            this.addError('❌ Missing i18n.js script');
        }
        
        // Check if index.html has i18n integration
        const indexPath = path.join(this.publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            if (content.includes('i18n.js') && content.includes('language-switcher')) {
                this.addCheck('✅', 'index.html has i18n integration');
            } else {
                this.addWarning('⚠️  index.html may need i18n integration');
            }
        }
    }

    addCheck(icon, message) {
        this.checks.push({ icon, message, type: 'success' });
    }

    addWarning(message) {
        this.warnings.push(message);
        this.checks.push({ icon: '⚠️', message, type: 'warning' });
    }

    addError(message) {
        this.errors.push(message);
        this.checks.push({ icon: '❌', message, type: 'error' });
    }

    generateFinalReport() {
        console.log('\n📊 FINAL DEPLOYMENT REPORT');
        console.log('='.repeat(50));
        
        // Summary
        const passed = this.checks.filter(c => c.type === 'success').length;
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${passed}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const check of this.checks) {
            console.log(`${check.icon} ${check.message}`);
        }
        
        // Deployment readiness
        console.log('\n🚀 DEPLOYMENT READINESS:');
        if (this.errors.length === 0) {
            console.log('✅ READY FOR DEPLOYMENT!');
            console.log('   All critical checks passed.');
            if (this.warnings.length > 0) {
                console.log(`   Consider addressing ${this.warnings.length} warnings for better quality.`);
            }
            console.log('\n🎯 NEXT STEPS:');
            console.log('   1. Push changes to GitHub');
            console.log('   2. Deploy to Vercel');
            console.log('   3. Test live deployment');
            console.log('   4. Run Lighthouse audit');
        } else {
            console.log('❌ NOT READY FOR DEPLOYMENT');
            console.log(`   Please fix ${this.errors.length} critical errors first.`);
            
            if (this.errors.length > 0) {
                console.log('\n🔧 CRITICAL ISSUES TO FIX:');
                for (const error of this.errors) {
                    console.log(`   ${error}`);
                }
            }
        }
        
        console.log('\n' + '='.repeat(50));
        
        return this.errors.length === 0;
    }
}

// Run the check if this script is executed directly
if (require.main === module) {
    const checker = new FinalDeploymentChecker();
    checker.runFinalCheck().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Check failed:', error);
        process.exit(1);
    });
}

module.exports = FinalDeploymentChecker;
