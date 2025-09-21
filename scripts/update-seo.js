/**
 * Update SEO meta tags for all HTML pages
 */

const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, '..', 'public');

const pageConfigs = {
    "admin-login.html": {
        title: "Admin Login - EduPlatform LMS",
        description: "Secure admin login for EduPlatform Learning Management System. Access admin dashboard and manage educational content.",
        keywords: "admin login, LMS admin, education management, admin dashboard"
    },
    "admin-dashboard.html": {
        title: "Admin Dashboard - EduPlatform LMS", 
        description: "Comprehensive admin dashboard for managing courses, students, and educational content in EduPlatform LMS.",
        keywords: "admin dashboard, LMS management, course management, student management"
    },
    "student-login.html": {
        title: "Student Login - EduPlatform LMS",
        description: "Student login portal for EduPlatform Learning Management System. Access your courses and learning materials.",
        keywords: "student login, LMS student, online learning, student portal"
    },
    "student-dashboard.html": {
        title: "Student Dashboard - EduPlatform LMS",
        description: "Personal student dashboard in EduPlatform LMS. Track your progress, access courses, and manage your learning journey.",
        keywords: "student dashboard, learning progress, course access, student portal"
    },
    "course-management.html": {
        title: "Course Management - EduPlatform LMS",
        description: "Create, edit, and manage educational courses in EduPlatform Learning Management System.",
        keywords: "course management, create courses, edit courses, LMS courses"
    },
    "course-player.html": {
        title: "Course Player - EduPlatform LMS",
        description: "Interactive course player for EduPlatform LMS. Watch videos, read materials, and complete assignments.",
        keywords: "course player, online courses, video learning, interactive content"
    },
    "quiz-management.html": {
        title: "Quiz Management - EduPlatform LMS",
        description: "Create and manage quizzes, tests, and assessments in EduPlatform Learning Management System.",
        keywords: "quiz management, create quizzes, assessments, LMS testing"
    },
    "quiz-interface.html": {
        title: "Quiz Interface - EduPlatform LMS",
        description: "Take quizzes and assessments in EduPlatform LMS. Interactive quiz interface with real-time feedback.",
        keywords: "take quiz, online assessment, quiz interface, LMS testing"
    },
    "order-management.html": {
        title: "Order Management - EduPlatform LMS",
        description: "Manage course orders and payments in EduPlatform Learning Management System.",
        keywords: "order management, course orders, payment processing, LMS orders"
    },
    "admin-student-management.html": {
        title: "Student Management - EduPlatform LMS",
        description: "Manage student accounts, enrollment, and academic records in EduPlatform LMS admin panel.",
        keywords: "student management, student accounts, enrollment, academic records"
    },
    "student-profile.html": {
        title: "Student Profile - EduPlatform LMS",
        description: "Manage your student profile, update personal information, and track academic progress in EduPlatform LMS.",
        keywords: "student profile, personal information, academic progress, profile management"
    },
    "ai-analytics-dashboard.html": {
        title: "AI Analytics Dashboard - EduPlatform LMS",
        description: "Advanced AI-powered analytics dashboard for EduPlatform LMS. Track learning patterns and performance metrics.",
        keywords: "AI analytics, learning analytics, performance metrics, educational data"
    },
    "ai-dashboard.html": {
        title: "AI Dashboard - EduPlatform LMS",
        description: "Artificial Intelligence dashboard for EduPlatform LMS. AI-powered features and insights.",
        keywords: "AI dashboard, artificial intelligence, smart features, AI insights"
    },
    "certificate-manager.html": {
        title: "Certificate Manager - EduPlatform LMS",
        description: "Issue, manage, and track educational certificates in EduPlatform Learning Management System.",
        keywords: "certificate management, digital certificates, course completion, certification"
    },
    "collaborative-workspace.html": {
        title: "Collaborative Workspace - EduPlatform LMS",
        description: "Team collaboration tools and workspace features in EduPlatform Learning Management System.",
        keywords: "collaboration, team workspace, group projects, collaborative learning"
    },
    "live-classroom.html": {
        title: "Live Classroom - EduPlatform LMS",
        description: "Real-time online classroom features for EduPlatform LMS. Interactive live sessions and virtual learning.",
        keywords: "live classroom, online learning, virtual classroom, real-time education"
    },
    "vr-learning-lab.html": {
        title: "VR Learning Lab - EduPlatform LMS",
        description: "Virtual Reality learning laboratory in EduPlatform LMS. Immersive educational experiences.",
        keywords: "VR learning, virtual reality, immersive learning, VR education"
    },
    "features-showcase.html": {
        title: "Features Showcase - EduPlatform LMS",
        description: "Explore all features and capabilities of EduPlatform Learning Management System.",
        keywords: "LMS features, educational technology, learning platform, feature showcase"
    }
};

function updateSEO() {
    console.log('🔍 Updating SEO for all HTML pages...\n');
    
    const htmlFiles = fs.readdirSync(publicPath)
        .filter(file => file.endsWith('.html'));
    
    let updated = 0;
    
    for (const fileName of htmlFiles) {
        if (pageConfigs[fileName]) {
            const config = pageConfigs[fileName];
            const filePath = path.join(publicPath, fileName);
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            
            // Update title
            content = content.replace(/<title>.*?<\/title>/i, `<title>${config.title}</title>`);
            
            // Update meta description
            content = content.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${config.description}"`);
            
            // Update meta keywords
            content = content.replace(/<meta name="keywords" content="[^"]*"/i, `<meta name="keywords" content="${config.keywords}"`);
            
            // Update Open Graph title
            content = content.replace(/<meta property="og:title" content="[^"]*"/i, `<meta property="og:title" content="${config.title}"`);
            
            // Update Open Graph description
            content = content.replace(/<meta property="og:description" content="[^"]*"/i, `<meta property="og:description" content="${config.description}"`);
            
            // Update Twitter title
            content = content.replace(/<meta property="twitter:title" content="[^"]*"/i, `<meta property="twitter:title" content="${config.title}"`);
            
            // Update Twitter description
            content = content.replace(/<meta property="twitter:description" content="[^"]*"/i, `<meta property="twitter:description" content="${config.description}"`);
            
            // Add missing meta tags if not present
            if (!content.match(/<meta name="description"/i)) {
                content = content.replace(
                    /(<meta name="viewport"[^>]*>)/i,
                    `$1\n    <meta name="description" content="${config.description}">`
                );
            }
            
            if (!content.match(/<meta name="keywords"/i)) {
                content = content.replace(
                    /(<meta name="description"[^>]*>)/i,
                    `$1\n    <meta name="keywords" content="${config.keywords}">`
                );
            }
            
            if (!content.match(/<meta property="og:title"/i)) {
                content = content.replace(
                    /(<meta name="keywords"[^>]*>)/i,
                    `$1\n    \n    <!-- Open Graph / Facebook -->\n    <meta property="og:type" content="website">\n    <meta property="og:title" content="${config.title}">\n    <meta property="og:description" content="${config.description}">`
                );
            }
            
            if (!content.match(/<meta property="twitter:title"/i)) {
                content = content.replace(
                    /(<meta property="og:description"[^>]*>)/i,
                    `$1\n    \n    <!-- Twitter -->\n    <meta property="twitter:card" content="summary_large_image">\n    <meta property="twitter:title" content="${config.title}">\n    <meta property="twitter:description" content="${config.description}">`
                );
            }
            
            // Save updated content
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Updated SEO for: ${fileName}`);
                updated++;
            } else {
                console.log(`⏭️  No changes needed: ${fileName}`);
            }
        } else {
            console.log(`⚠️  No config for: ${fileName}`);
        }
    }
    
    console.log(`\n🎉 SEO update completed!`);
    console.log(`📊 Summary:`);
    console.log(`  ✅ Updated: ${updated} files`);
    console.log(`  📄 Total: ${htmlFiles.length} files`);
}

// Run if this script is executed directly
if (require.main === module) {
    updateSEO();
}

module.exports = updateSEO;
