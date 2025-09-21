/**
 * Generate sitemap.xml for EduPlatform
 */

const fs = require('fs');
const path = require('path');

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://eduplatform-lms.vercel.app';

const pages = [
    // Main pages
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: 'features-showcase.html', priority: 0.9, changefreq: 'weekly' },
    { url: 'ai-dashboard.html', priority: 0.8, changefreq: 'weekly' },
    { url: 'ai-analytics-dashboard.html', priority: 0.8, changefreq: 'weekly' },
    
    // Authentication pages
    { url: 'admin-login.html', priority: 0.7, changefreq: 'monthly' },
    { url: 'student-login.html', priority: 0.7, changefreq: 'monthly' },
    
    // Dashboard pages
    { url: 'admin-dashboard.html', priority: 0.6, changefreq: 'daily' },
    { url: 'student-dashboard.html', priority: 0.6, changefreq: 'daily' },
    
    // Feature pages
    { url: 'course-management.html', priority: 0.8, changefreq: 'weekly' },
    { url: 'course-player.html', priority: 0.8, changefreq: 'weekly' },
    { url: 'quiz-interface.html', priority: 0.8, changefreq: 'weekly' },
    { url: 'quiz-management.html', priority: 0.7, changefreq: 'weekly' },
    { url: 'student-profile.html', priority: 0.6, changefreq: 'weekly' },
    { url: 'admin-student-management.html', priority: 0.7, changefreq: 'weekly' },
    { url: 'order-management.html', priority: 0.6, changefreq: 'weekly' },
    
    // Advanced features
    { url: 'certificate-manager.html', priority: 0.7, changefreq: 'weekly' },
    { url: 'collaborative-workspace.html', priority: 0.7, changefreq: 'weekly' },
    { url: 'live-classroom.html', priority: 0.7, changefreq: 'weekly' },
    { url: 'vr-learning-lab.html', priority: 0.6, changefreq: 'monthly' }
];

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log('✅ Sitemap generated successfully');
    console.log(`📄 Generated ${pages.length} URLs`);
    console.log(`🔗 Base URL: ${baseUrl}`);
}

if (require.main === module) {
    generateSitemap();
}

module.exports = generateSitemap;
