/**
 * EduPlatform Internationalization (i18n) System
 * Supports Vietnamese, Chinese, and English
 */

class I18nManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectLanguage();
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.supportedLanguages = ['en', 'vi', 'zh'];
        
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyTranslations();
        this.setupLanguageSwitcher();
        this.setupAutoDetection();
    }

    async loadTranslations() {
        try {
            // Load English (default)
            this.translations.en = await this.loadLanguageFile('en');
            
            // Load Vietnamese
            this.translations.vi = await this.loadLanguageFile('vi');
            
            // Load Chinese
            this.translations.zh = await this.loadLanguageFile('zh');
            
            console.log('✅ Translations loaded successfully');
        } catch (error) {
            console.error('❌ Failed to load translations:', error);
            // Fallback to inline translations
            this.loadInlineTranslations();
        }
    }

    async loadLanguageFile(language) {
        try {
            const response = await fetch(`./locales/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${language}.json`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Using inline translations for ${language}`);
            return this.getInlineTranslations(language);
        }
    }

    getInlineTranslations(language) {
        const translations = {
            en: {
                // Navigation
                "nav.home": "Home",
                "nav.features": "Features",
                "nav.ai_dashboard": "AI Dashboard",
                "nav.admin_login": "Admin Login",
                "nav.student_login": "Student Login",
                "nav.admin_dashboard": "Admin Dashboard",
                "nav.student_dashboard": "Student Dashboard",
                
                // Main Content
                "title.main": "EduPlatform Learning Management System",
                "subtitle.main": "A comprehensive platform for managing courses, students, and educational content with modern UI and powerful features.",
                "section.admin_dashboard": "Admin Dashboard",
                
                // Admin Features
                "admin.login.title": "Admin Login",
                "admin.login.subtitle": "Secure admin authentication",
                "admin.dashboard.title": "Admin Dashboard",
                "admin.dashboard.subtitle": "Overview and analytics",
                "admin.student_management.title": "Student Management",
                "admin.student_management.subtitle": "Manage student accounts",
                
                // Course Features
                "course.management.title": "Course Management",
                "course.management.subtitle": "Create and manage courses",
                "course.player.title": "Course Player",
                "course.player.subtitle": "Interactive course content",
                
                // Quiz Features
                "quiz.management.title": "Quiz Management",
                "quiz.management.subtitle": "Create and manage quizzes",
                "quiz.interface.title": "Quiz Interface",
                "quiz.interface.subtitle": "Take quizzes and assessments",
                
                // Order Features
                "order.management.title": "Order Management",
                "order.management.subtitle": "Manage course orders",
                
                // Student Features
                "student.dashboard.title": "Student Dashboard",
                "student.dashboard.subtitle": "Your learning overview",
                "student.profile.title": "Student Profile",
                "student.profile.subtitle": "Manage your profile",
                
                // Advanced Features
                "ai.analytics.title": "AI Analytics",
                "ai.analytics.subtitle": "Advanced analytics dashboard",
                "certificate.manager.title": "Certificate Manager",
                "certificate.manager.subtitle": "Issue and manage certificates",
                "collaborative.workspace.title": "Collaborative Workspace",
                "collaborative.workspace.subtitle": "Team collaboration tools",
                "live.classroom.title": "Live Classroom",
                "live.classroom.subtitle": "Real-time online classes",
                "vr.learning.title": "VR Learning Lab",
                "vr.learning.subtitle": "Virtual reality learning",
                
                // Common
                "button.login": "Login",
                "button.register": "Register",
                "button.get_started": "Get Started",
                "button.learn_more": "Learn More",
                "button.view_all": "View All",
                "button.continue": "Continue",
                "button.back": "Back",
                "button.next": "Next",
                "button.save": "Save",
                "button.cancel": "Cancel",
                "button.submit": "Submit",
                "button.edit": "Edit",
                "button.delete": "Delete",
                "button.create": "Create",
                "button.update": "Update",
                
                // Language Switcher
                "language.english": "English",
                "language.vietnamese": "Tiếng Việt",
                "language.chinese": "中文",
                "language.switch_to": "Switch to",
                
                // Footer
                "footer.copyright": "© 2024 EduPlatform. All rights reserved.",
                "footer.privacy": "Privacy Policy",
                "footer.terms": "Terms of Service",
                "footer.contact": "Contact Us",
                "footer.support": "Support"
            },
            
            vi: {
                // Navigation
                "nav.home": "Trang chủ",
                "nav.features": "Tính năng",
                "nav.ai_dashboard": "Bảng điều khiển AI",
                "nav.admin_login": "Đăng nhập Admin",
                "nav.student_login": "Đăng nhập Học sinh",
                "nav.admin_dashboard": "Bảng điều khiển Admin",
                "nav.student_dashboard": "Bảng điều khiển Học sinh",
                
                // Main Content
                "title.main": "Hệ thống Quản lý Học tập EduPlatform",
                "subtitle.main": "Nền tảng toàn diện để quản lý khóa học, học sinh và nội dung giáo dục với giao diện hiện đại và tính năng mạnh mẽ.",
                "section.admin_dashboard": "Bảng điều khiển Admin",
                
                // Admin Features
                "admin.login.title": "Đăng nhập Admin",
                "admin.login.subtitle": "Xác thực admin bảo mật",
                "admin.dashboard.title": "Bảng điều khiển Admin",
                "admin.dashboard.subtitle": "Tổng quan và phân tích",
                "admin.student_management.title": "Quản lý Học sinh",
                "admin.student_management.subtitle": "Quản lý tài khoản học sinh",
                
                // Course Features
                "course.management.title": "Quản lý Khóa học",
                "course.management.subtitle": "Tạo và quản lý khóa học",
                "course.player.title": "Trình phát Khóa học",
                "course.player.subtitle": "Nội dung khóa học tương tác",
                
                // Quiz Features
                "quiz.management.title": "Quản lý Bài kiểm tra",
                "quiz.management.subtitle": "Tạo và quản lý bài kiểm tra",
                "quiz.interface.title": "Giao diện Bài kiểm tra",
                "quiz.interface.subtitle": "Làm bài kiểm tra và đánh giá",
                
                // Order Features
                "order.management.title": "Quản lý Đơn hàng",
                "order.management.subtitle": "Quản lý đơn hàng khóa học",
                
                // Student Features
                "student.dashboard.title": "Bảng điều khiển Học sinh",
                "student.dashboard.subtitle": "Tổng quan học tập của bạn",
                "student.profile.title": "Hồ sơ Học sinh",
                "student.profile.subtitle": "Quản lý hồ sơ của bạn",
                
                // Advanced Features
                "ai.analytics.title": "Phân tích AI",
                "ai.analytics.subtitle": "Bảng điều khiển phân tích nâng cao",
                "certificate.manager.title": "Quản lý Chứng chỉ",
                "certificate.manager.subtitle": "Cấp và quản lý chứng chỉ",
                "collaborative.workspace.title": "Không gian Cộng tác",
                "collaborative.workspace.subtitle": "Công cụ cộng tác nhóm",
                "live.classroom.title": "Lớp học Trực tuyến",
                "live.classroom.subtitle": "Lớp học trực tuyến thời gian thực",
                "vr.learning.title": "Phòng thí nghiệm Học VR",
                "vr.learning.subtitle": "Học tập thực tế ảo",
                
                // Common
                "button.login": "Đăng nhập",
                "button.register": "Đăng ký",
                "button.get_started": "Bắt đầu",
                "button.learn_more": "Tìm hiểu thêm",
                "button.view_all": "Xem tất cả",
                "button.continue": "Tiếp tục",
                "button.back": "Quay lại",
                "button.next": "Tiếp theo",
                "button.save": "Lưu",
                "button.cancel": "Hủy",
                "button.submit": "Gửi",
                "button.edit": "Chỉnh sửa",
                "button.delete": "Xóa",
                "button.create": "Tạo",
                "button.update": "Cập nhật",
                
                // Language Switcher
                "language.english": "English",
                "language.vietnamese": "Tiếng Việt",
                "language.chinese": "中文",
                "language.switch_to": "Chuyển sang",
                
                // Footer
                "footer.copyright": "© 2024 EduPlatform. Tất cả quyền được bảo lưu.",
                "footer.privacy": "Chính sách Bảo mật",
                "footer.terms": "Điều khoản Dịch vụ",
                "footer.contact": "Liên hệ",
                "footer.support": "Hỗ trợ"
            },
            
            zh: {
                // Navigation
                "nav.home": "首页",
                "nav.features": "功能",
                "nav.ai_dashboard": "AI仪表板",
                "nav.admin_login": "管理员登录",
                "nav.student_login": "学生登录",
                "nav.admin_dashboard": "管理员仪表板",
                "nav.student_dashboard": "学生仪表板",
                
                // Main Content
                "title.main": "EduPlatform学习管理系统",
                "subtitle.main": "一个综合平台，用于管理课程、学生和教育内容，具有现代化的用户界面和强大的功能。",
                "section.admin_dashboard": "管理员仪表板",
                
                // Admin Features
                "admin.login.title": "管理员登录",
                "admin.login.subtitle": "安全的管理员认证",
                "admin.dashboard.title": "管理员仪表板",
                "admin.dashboard.subtitle": "概览和分析",
                "admin.student_management.title": "学生管理",
                "admin.student_management.subtitle": "管理学生账户",
                
                // Course Features
                "course.management.title": "课程管理",
                "course.management.subtitle": "创建和管理课程",
                "course.player.title": "课程播放器",
                "course.player.subtitle": "交互式课程内容",
                
                // Quiz Features
                "quiz.management.title": "测验管理",
                "quiz.management.subtitle": "创建和管理测验",
                "quiz.interface.title": "测验界面",
                "quiz.interface.subtitle": "参加测验和评估",
                
                // Order Features
                "order.management.title": "订单管理",
                "order.management.subtitle": "管理课程订单",
                
                // Student Features
                "student.dashboard.title": "学生仪表板",
                "student.dashboard.subtitle": "您的学习概览",
                "student.profile.title": "学生档案",
                "student.profile.subtitle": "管理您的档案",
                
                // Advanced Features
                "ai.analytics.title": "AI分析",
                "ai.analytics.subtitle": "高级分析仪表板",
                "certificate.manager.title": "证书管理器",
                "certificate.manager.subtitle": "颁发和管理证书",
                "collaborative.workspace.title": "协作工作区",
                "collaborative.workspace.subtitle": "团队协作工具",
                "live.classroom.title": "在线课堂",
                "live.classroom.subtitle": "实时在线课程",
                "vr.learning.title": "VR学习实验室",
                "vr.learning.subtitle": "虚拟现实学习",
                
                // Common
                "button.login": "登录",
                "button.register": "注册",
                "button.get_started": "开始",
                "button.learn_more": "了解更多",
                "button.view_all": "查看全部",
                "button.continue": "继续",
                "button.back": "返回",
                "button.next": "下一步",
                "button.save": "保存",
                "button.cancel": "取消",
                "button.submit": "提交",
                "button.edit": "编辑",
                "button.delete": "删除",
                "button.create": "创建",
                "button.update": "更新",
                
                // Language Switcher
                "language.english": "English",
                "language.vietnamese": "Tiếng Việt",
                "language.chinese": "中文",
                "language.switch_to": "切换到",
                
                // Footer
                "footer.copyright": "© 2024 EduPlatform. 保留所有权利。",
                "footer.privacy": "隐私政策",
                "footer.terms": "服务条款",
                "footer.contact": "联系我们",
                "footer.support": "支持"
            }
        };
        
        return translations[language] || translations[this.fallbackLanguage];
    }

    loadInlineTranslations() {
        this.translations.en = this.getInlineTranslations('en');
        this.translations.vi = this.getInlineTranslations('vi');
        this.translations.zh = this.getInlineTranslations('zh');
    }

    getStoredLanguage() {
        return localStorage.getItem('eduplatform_language');
    }

    setStoredLanguage(language) {
        localStorage.setItem('eduplatform_language', language);
    }

    detectLanguage() {
        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Check if supported
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        // Check for Vietnamese variants
        if (browserLang.includes('vi') || browserLang.includes('VN')) {
            return 'vi';
        }
        
        // Check for Chinese variants
        if (browserLang.includes('zh') || browserLang.includes('CN') || browserLang.includes('TW')) {
            return 'zh';
        }
        
        // Default to English
        return 'en';
    }

    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] || 
                           this.translations[this.fallbackLanguage]?.[key] || 
                           key;
        
        // Replace parameters
        return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] || match;
        });
    }

    setLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.warn(`Language ${language} is not supported`);
            return;
        }
        
        this.currentLanguage = language;
        this.setStoredLanguage(language);
        this.applyTranslations();
        
        // Update HTML lang attribute
        document.documentElement.lang = language;
        
        // Update navigation manager if available
        if (window.navigationManager) {
            window.navigationManager.setUserRole(window.navigationManager.getCurrentUserRole());
        }
        
        // Track language change
        if (window.vercelAnalytics) {
            window.vercelAnalytics.track('language_change', {
                language: language,
                previousLanguage: this.getStoredLanguage()
            });
        }
        
        console.log(`Language changed to: ${language}`);
    }

    applyTranslations() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = this.t('title.main');
        }
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.t('subtitle.main');
        }
    }

    setupLanguageSwitcher() {
        // Create language switcher if it doesn't exist
        let switcher = document.getElementById('language-switcher');
        if (!switcher) {
            switcher = document.createElement('div');
            switcher.id = 'language-switcher';
            switcher.className = 'language-switcher';
            
            // Add to header if it exists
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(switcher);
            }
        }
        
        switcher.innerHTML = this.createLanguageSwitcherHTML();
        
        // Add event listeners
        switcher.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const language = e.currentTarget.dataset.language;
                this.setLanguage(language);
            });
        });
    }

    createLanguageSwitcherHTML() {
        return `
            <div class="language-dropdown">
                <button class="language-toggle" aria-label="${this.t('language.switch_to')}">
                    <span class="language-flag">${this.getLanguageFlag(this.currentLanguage)}</span>
                    <span class="language-name">${this.t(`language.${this.currentLanguage}`)}</span>
                    <svg class="dropdown-icon" width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="language-options">
                    <div class="language-option ${this.currentLanguage === 'en' ? 'active' : ''}" data-language="en">
                        <span class="language-flag">🇺🇸</span>
                        <span class="language-name">${this.t('language.english')}</span>
                    </div>
                    <div class="language-option ${this.currentLanguage === 'vi' ? 'active' : ''}" data-language="vi">
                        <span class="language-flag">🇻🇳</span>
                        <span class="language-name">${this.t('language.vietnamese')}</span>
                    </div>
                    <div class="language-option ${this.currentLanguage === 'zh' ? 'active' : ''}" data-language="zh">
                        <span class="language-flag">🇨🇳</span>
                        <span class="language-name">${this.t('language.chinese')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getLanguageFlag(language) {
        const flags = {
            'en': '🇺🇸',
            'vi': '🇻🇳',
            'zh': '🇨🇳'
        };
        return flags[language] || '🌐';
    }

    setupAutoDetection() {
        // Auto-detect language from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam && this.supportedLanguages.includes(langParam)) {
            this.setLanguage(langParam);
        }
        
        // Auto-detect from browser settings on first visit
        if (!this.getStoredLanguage()) {
            const detectedLang = this.detectLanguage();
            this.setLanguage(detectedLang);
        }
    }

    // Public methods
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    addTranslation(key, translation, language = null) {
        const lang = language || this.currentLanguage;
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }
        this.translations[lang][key] = translation;
    }

    getTranslations(language = null) {
        const lang = language || this.currentLanguage;
        return this.translations[lang] || {};
    }
}

// Initialize i18n when DOM is loaded
let i18nManager;

document.addEventListener('DOMContentLoaded', () => {
    i18nManager = new I18nManager();
    
    // Make available globally
    window.i18n = i18nManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}
