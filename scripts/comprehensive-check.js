/**
 * Comprehensive WebApp Check Script
 * Validates all aspects of EduPlatform before deployment
 */

const fs = require('fs');
const path = require('path');

class WebAppChecker {
    constructor() {
        this.publicPath = path.join(__dirname, '..', 'public');
        this.errors = [];
        this.warnings = [];
        this.checks = [];
    }

    async runAllChecks() {
        console.log('🔍 Starting Comprehensive WebApp Check...\n');
        
        await this.checkProjectStructure();
        await this.checkRequiredFiles();
        await this.checkHTMLStructure();
        await this.checkNavigationLinks();
        await this.checkSEO();
        await this.checkPerformance();
        await this.checkSecurity();
        await this.checkResponsiveDesign();
        await this.checkAccessibility();
        await this.checkInternationalization();
        
        this.generateReport();
    }

    async checkProjectStructure() {
        console.log('📁 Checking Project Structure...');
        
        const requiredDirs = ['scripts', 'styles', 'locales'];
        const requiredFiles = ['index.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest'];
        
        // Check directories
        for (const dir of requiredDirs) {
            const dirPath = path.join(this.publicPath, dir);
            if (fs.existsSync(dirPath)) {
                this.addCheck('✅', `Directory ${dir}/ exists`);
            } else {
                this.addError(`❌ Missing directory: ${dir}/`);
            }
        }
        
        // Check files
        for (const file of requiredFiles) {
            const filePath = path.join(this.publicPath, file);
            if (fs.existsSync(filePath)) {
                this.addCheck('✅', `File ${file} exists`);
            } else {
                this.addError(`❌ Missing file: ${file}`);
            }
        }
        
        // Check HTML pages count
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        this.addCheck('✅', `Found ${htmlFiles.length} HTML pages`);
        
        if (htmlFiles.length < 10) {
            this.addWarning('⚠️  Consider adding more pages for better content coverage');
        }
    }

    async checkRequiredFiles() {
        console.log('📄 Checking Required Files...');
        
        // Check index.html
        const indexPath = path.join(this.publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            
            // Check for essential elements
            const checks = [
                { name: 'DOCTYPE declaration', pattern: /<!DOCTYPE html>/i },
                { name: 'HTML lang attribute', pattern: /<html[^>]*lang=/i },
                { name: 'Meta charset', pattern: /<meta[^>]*charset/i },
                { name: 'Meta viewport', pattern: /<meta[^>]*viewport/i },
                { name: 'Title tag', pattern: /<title>/i },
                { name: 'Meta description', pattern: /<meta[^>]*description/i },
                { name: 'Favicon link', pattern: /<link[^>]*favicon/i },
                { name: 'Language switcher', pattern: /language-switcher/i },
                { name: 'i18n script', pattern: /i18n\.js/i },
                { name: 'Navigation script', pattern: /navigation\.js/i }
            ];
            
            for (const check of checks) {
                if (check.pattern.test(content)) {
                    this.addCheck('✅', `index.html has ${check.name}`);
                } else {
                    this.addError(`❌ index.html missing ${check.name}`);
                }
            }
        }
        
        // Check robots.txt
        const robotsPath = path.join(this.publicPath, 'robots.txt');
        if (fs.existsSync(robotsPath)) {
            const content = fs.readFileSync(robotsPath, 'utf8');
            if (content.includes('User-agent:') && content.includes('Sitemap:')) {
                this.addCheck('✅', 'robots.txt is properly configured');
            } else {
                this.addError('❌ robots.txt is incomplete');
            }
        }
        
        // Check sitemap.xml
        const sitemapPath = path.join(this.publicPath, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            if (content.includes('<urlset') && content.includes('<url>')) {
                const urlCount = (content.match(/<url>/g) || []).length;
                this.addCheck('✅', `sitemap.xml contains ${urlCount} URLs`);
            } else {
                this.addError('❌ sitemap.xml is malformed');
            }
        }
        
        // Check manifest
        const manifestPath = path.join(this.publicPath, 'site.webmanifest');
        if (fs.existsSync(manifestPath)) {
            try {
                const content = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
                if (content.name && content.short_name && content.icons) {
                    this.addCheck('✅', 'site.webmanifest is properly configured');
                } else {
                    this.addError('❌ site.webmanifest is incomplete');
                }
            } catch (e) {
                this.addError('❌ site.webmanifest is not valid JSON');
            }
        }
    }

    async checkHTMLStructure() {
        console.log('🏗️  Checking HTML Structure...');
        
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Basic HTML structure checks
            const structureChecks = [
                { name: 'DOCTYPE', pattern: /<!DOCTYPE html>/i },
                { name: 'HTML tag', pattern: /<html/i },
                { name: 'Head section', pattern: /<head>/i },
                { name: 'Body section', pattern: /<body>/i },
                { name: 'Meta charset', pattern: /<meta[^>]*charset/i },
                { name: 'Title tag', pattern: /<title>/i }
            ];
            
            let validStructure = true;
            for (const check of structureChecks) {
                if (!check.pattern.test(content)) {
                    this.addError(`❌ ${file} missing ${check.name}`);
                    validStructure = false;
                }
            }
            
            if (validStructure) {
                this.addCheck('✅', `${file} has valid HTML structure`);
            }
            
            // Check for i18n integration
            if (content.includes('data-i18n=') || content.includes('i18n.js')) {
                this.addCheck('✅', `${file} has i18n integration`);
            } else if (file !== '404.html' && file !== '500.html') {
                this.addWarning(`⚠️  ${file} may need i18n integration`);
            }
        }
    }

    async checkNavigationLinks() {
        console.log('🔗 Checking Navigation Links...');
        
        const indexPath = path.join(this.publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            
            // Extract navigation links
            const linkPattern = /navigationManager\.navigateTo\(['"]([^'"]+)['"]\)/g;
            const links = [];
            let match;
            
            while ((match = linkPattern.exec(content)) !== null) {
                links.push(match[1]);
            }
            
            // Check if target pages exist
            const expectedPages = [
                'adminLogin', 'adminDashboard', 'studentLogin', 'studentDashboard',
                'courseManagement', 'coursePlayer', 'quizManagement', 'quizInterface',
                'orderManagement', 'adminStudentManagement', 'studentProfile'
            ];
            
            for (const link of links) {
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
                
                const targetFile = pageMap[link];
                if (targetFile) {
                    const targetPath = path.join(this.publicPath, targetFile);
                    if (fs.existsSync(targetPath)) {
                        this.addCheck('✅', `Navigation link '${link}' points to existing ${targetFile}`);
                    } else {
                        this.addError(`❌ Navigation link '${link}' points to missing ${targetFile}`);
                    }
                }
            }
            
            this.addCheck('✅', `Found ${links.length} navigation links in index.html`);
        }
    }

    async checkSEO() {
        console.log('🔍 Checking SEO...');
        
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html') && file !== '404.html' && file !== '500.html');
        
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // SEO checks
            const seoChecks = [
                { name: 'Title tag', pattern: /<title>[^<]+<\/title>/i },
                { name: 'Meta description', pattern: /<meta[^>]*name=["\']description["\'][^>]*content=/i },
                { name: 'Meta keywords', pattern: /<meta[^>]*name=["\']keywords["\'][^>]*content=/i },
                { name: 'Open Graph title', pattern: /<meta[^>]*property=["\']og:title["\'][^>]*content=/i },
                { name: 'Open Graph description', pattern: /<meta[^>]*property=["\']og:description["\'][^>]*content=/i },
                { name: 'Twitter card', pattern: /<meta[^>]*property=["\']twitter:card["\'][^>]*content=/i }
            ];
            
            let seoScore = 0;
            for (const check of seoChecks) {
                if (check.pattern.test(content)) {
                    seoScore++;
                }
            }
            
            if (seoScore >= 4) {
                this.addCheck('✅', `${file} has good SEO (${seoScore}/6)`);
            } else {
                this.addWarning(`⚠️  ${file} needs SEO improvement (${seoScore}/6)`);
            }
        }
        
        // Check sitemap
        const sitemapPath = path.join(this.publicPath, 'sitemap.xml');
        if (fs.existsSync(sitemapPath)) {
            const content = fs.readFileSync(sitemapPath, 'utf8');
            if (!content.includes('yourdomain.com')) {
                this.addCheck('✅', 'sitemap.xml has proper domain');
            } else {
                this.addWarning('⚠️  sitemap.xml still contains placeholder domain');
            }
        }
    }

    async checkPerformance() {
        console.log('⚡ Checking Performance...');
        
        // Check for performance optimizations
        const indexPath = path.join(this.publicPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            
            const perfChecks = [
                { name: 'Preconnect links', pattern: /<link[^>]*rel=["\']preconnect["\']/i },
                { name: 'External CSS', pattern: /<link[^>]*rel=["\']stylesheet["\']/i },
                { name: 'Script optimization', pattern: /<script[^>]*defer/i },
                { name: 'Image optimization', pattern: /loading=["\']lazy["\']/i }
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
                this.addWarning(`⚠️  ${file} is large (${sizeKB}KB)`);
            }
        }
        
        if (largeFiles === 0) {
            this.addCheck('✅', 'All HTML files are reasonably sized');
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
                    'Strict-Transport-Security'
                ];
                
                let securityScore = 0;
                for (const header of securityHeaders) {
                    if (content.headers.some(h => h.headers && h.headers.some(header => header.key === header))) {
                        securityScore++;
                    }
                }
                
                if (securityScore >= 3) {
                    this.addCheck('✅', `Good security headers (${securityScore}/${securityHeaders.length})`);
                } else {
                    this.addWarning(`⚠️  Need more security headers (${securityScore}/${securityHeaders.length})`);
                }
            }
        }
        
        // Check for sensitive information in HTML
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for sensitive patterns
            const sensitivePatterns = [
                /password\s*[:=]\s*["'][^"']+["']/i,
                /api[_-]?key\s*[:=]\s*["'][^"']+["']/i,
                /secret\s*[:=]\s*["'][^"']+["']/i
            ];
            
            for (const pattern of sensitivePatterns) {
                if (pattern.test(content)) {
                    this.addError(`❌ ${file} may contain sensitive information`);
                    break;
                }
            }
        }
    }

    async checkResponsiveDesign() {
        console.log('📱 Checking Responsive Design...');
        
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const responsiveChecks = [
                { name: 'Viewport meta tag', pattern: /<meta[^>]*viewport[^>]*width=device-width/i },
                { name: 'Responsive CSS', pattern: /@media|responsive|mobile|tablet/i },
                { name: 'Flexible layout', pattern: /flex|grid|w-full|max-w/i }
            ];
            
            let responsiveScore = 0;
            for (const check of responsiveChecks) {
                if (check.pattern.test(content)) {
                    responsiveScore++;
                }
            }
            
            if (responsiveScore >= 2) {
                this.addCheck('✅', `${file} has responsive design elements`);
            } else {
                this.addWarning(`⚠️  ${file} may need responsive design improvements`);
            }
        }
    }

    async checkAccessibility() {
        console.log('♿ Checking Accessibility...');
        
        const htmlFiles = fs.readdirSync(this.publicPath)
            .filter(file => file.endsWith('.html'));
        
        for (const file of htmlFiles) {
            const filePath = path.join(this.publicPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const a11yChecks = [
                { name: 'Alt text for images', pattern: /<img[^>]*alt=/i },
                { name: 'Form labels', pattern: /<label[^>]*for=/i },
                { name: 'ARIA labels', pattern: /aria-label=/i },
                { name: 'Semantic HTML', pattern: /<main>|<nav>|<header>|<footer>/i }
            ];
            
            let a11yScore = 0;
            for (const check of a11yChecks) {
                if (check.pattern.test(content)) {
                    a11yScore++;
                }
            }
            
            if (a11yScore >= 2) {
                this.addCheck('✅', `${file} has accessibility features`);
            } else {
                this.addWarning(`⚠️  ${file} needs accessibility improvements`);
            }
        }
    }

    async checkInternationalization() {
        console.log('🌍 Checking Internationalization...');
        
        // Check for i18n files
        const localesPath = path.join(this.publicPath, 'locales');
        if (fs.existsSync(localesPath)) {
            const localeFiles = fs.readdirSync(localesPath)
                .filter(file => file.endsWith('.json'));
            
            this.addCheck('✅', `Found ${localeFiles.length} language files`);
            
            // Check if all languages have complete translations
            const expectedLanguages = ['en', 'vi', 'zh'];
            for (const lang of expectedLanguages) {
                const langFile = path.join(localesPath, `${lang}.json`);
                if (fs.existsSync(langFile)) {
                    try {
                        const content = JSON.parse(fs.readFileSync(langFile, 'utf8'));
                        const keyCount = Object.keys(content).length;
                        this.addCheck('✅', `${lang}.json has ${keyCount} translations`);
                    } catch (e) {
                        this.addError(`❌ ${lang}.json is not valid JSON`);
                    }
                } else {
                    this.addError(`❌ Missing language file: ${lang}.json`);
                }
            }
        } else {
            this.addError('❌ Missing locales directory');
        }
        
        // Check for i18n script
        const i18nScript = path.join(this.publicPath, 'scripts', 'i18n.js');
        if (fs.existsSync(i18nScript)) {
            this.addCheck('✅', 'i18n.js script exists');
        } else {
            this.addError('❌ Missing i18n.js script');
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

    generateReport() {
        console.log('\n📊 COMPREHENSIVE CHECK REPORT');
        console.log('='.repeat(50));
        
        // Summary
        console.log(`\n📈 SUMMARY:`);
        console.log(`✅ Passed: ${this.checks.filter(c => c.type === 'success').length}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS:');
        for (const check of this.checks) {
            console.log(`${check.icon} ${check.message}`);
        }
        
        // Recommendations
        if (this.errors.length > 0 || this.warnings.length > 0) {
            console.log('\n🔧 RECOMMENDATIONS:');
            
            if (this.errors.length > 0) {
                console.log('\n❌ CRITICAL ISSUES TO FIX:');
                for (const error of this.errors) {
                    console.log(`   ${error}`);
                }
            }
            
            if (this.warnings.length > 0) {
                console.log('\n⚠️  IMPROVEMENTS TO CONSIDER:');
                for (const warning of this.warnings) {
                    console.log(`   ${warning}`);
                }
            }
        }
        
        // Deployment readiness
        console.log('\n🚀 DEPLOYMENT READINESS:');
        if (this.errors.length === 0) {
            console.log('✅ READY FOR DEPLOYMENT!');
            console.log('   All critical checks passed.');
            if (this.warnings.length > 0) {
                console.log(`   Consider addressing ${this.warnings.length} warnings for better quality.`);
            }
        } else {
            console.log('❌ NOT READY FOR DEPLOYMENT');
            console.log(`   Please fix ${this.errors.length} critical errors first.`);
        }
        
        console.log('\n' + '='.repeat(50));
        
        // Return status for CI/CD
        return this.errors.length === 0;
    }
}

// Run the check if this script is executed directly
if (require.main === module) {
    const checker = new WebAppChecker();
    checker.runAllChecks().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Check failed:', error);
        process.exit(1);
    });
}

module.exports = WebAppChecker;
