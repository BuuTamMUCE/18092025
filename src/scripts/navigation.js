/**
 * EduPlatform Navigation System
 * Centralized navigation management for the LMS
 */

class NavigationManager {
    constructor() {
        this.routes = {
            // Public Pages
            home: '/',
            features: '/features-showcase.html',
            aiDashboard: '/ai-dashboard.html',
            aiAnalytics: '/ai-analytics-dashboard.html',
            certificateManager: '/certificate-manager.html',
            collaborativeWorkspace: '/collaborative-workspace.html',
            liveClassroom: '/live-classroom.html',
            vrLearningLab: '/vr-learning-lab.html',
            
            // Admin Routes
            adminLogin: '/src/pages/admin/login/admin_login_screen_1.html',
            adminDashboard: '/src/pages/admin/dashboard/admin_dashboard_4.html',
            adminStudentManagement: '/src/pages/admin/student_management_screen_1.html',
            
            // Student Routes
            studentLogin: '/src/pages/student/authentication/student_authentication_screens_2.html',
            studentDashboard: '/src/pages/student/dashboard/my_dashboard_(student)_1.html',
            studentProfile: '/src/pages/student/profile/my_profile_(student)_1.html',
            
            // Course Routes
            courseManagement: '/src/pages/course/management/course_management_screen_1.html',
            coursePlayer: '/src/pages/course/player/course_player_interface_1.html',
            
            // Quiz Routes
            quizInterface: '/src/pages/quiz/interface/quiz_interface_1.html',
            quizManagement: '/src/pages/quiz/management/quiz_management_screen_1.html',
            
            // Order Routes
            orderManagement: '/src/pages/order/management/order_management_screen_1.html'
        };
        
        this.userRoles = {
            ADMIN: 'admin',
            STUDENT: 'student',
            GUEST: 'guest'
        };
        
        this.currentUserRole = this.getCurrentUserRole();
    }

    /**
     * Get current user role from localStorage or URL
     */
    getCurrentUserRole() {
        const role = localStorage.getItem('userRole');
        const path = window.location.pathname;
        
        if (path.includes('/admin/')) return this.userRoles.ADMIN;
        if (path.includes('/student/')) return this.userRoles.STUDENT;
        
        return role || this.userRoles.GUEST;
    }

    /**
     * Navigate to a specific route
     */
    navigateTo(routeName, params = {}) {
        const route = this.routes[routeName];
        if (!route) {
            console.error(`Route '${routeName}' not found`);
            return false;
        }

        // Add query parameters if provided
        let url = route;
        if (Object.keys(params).length > 0) {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }

        // Show loading animation
        this.showLoading();
        
        // Navigate after a short delay for UX
        setTimeout(() => {
            window.location.href = url;
        }, 300);
        
        return true;
    }

    /**
     * Navigate with role-based access control
     */
    navigateWithAuth(routeName, requiredRole = null, params = {}) {
        const route = this.routes[routeName];
        if (!route) {
            console.error(`Route '${routeName}' not found`);
            return false;
        }

        // Check role-based access
        if (requiredRole && !this.hasPermission(requiredRole)) {
            this.showAccessDenied();
            return false;
        }

        return this.navigateTo(routeName, params);
    }

    /**
     * Check if user has permission for a role
     */
    hasPermission(requiredRole) {
        const roleHierarchy = {
            [this.userRoles.ADMIN]: ['admin', 'student', 'guest'],
            [this.userRoles.STUDENT]: ['student', 'guest'],
            [this.userRoles.GUEST]: ['guest']
        };

        const userPermissions = roleHierarchy[this.currentUserRole] || [];
        return userPermissions.includes(requiredRole);
    }

    /**
     * Get navigation menu based on user role
     */
    getNavigationMenu() {
        const baseMenu = {
            [this.userRoles.GUEST]: [
                { name: 'Home', route: 'home', icon: '🏠' },
                { name: 'Features', route: 'features', icon: '✨' },
                { name: 'AI Dashboard', route: 'aiDashboard', icon: '🤖' },
                { name: 'Student Login', route: 'studentLogin', icon: '👨‍🎓' },
                { name: 'Admin Login', route: 'adminLogin', icon: '👨‍💼' }
            ],
            [this.userRoles.STUDENT]: [
                { name: 'Dashboard', route: 'studentDashboard', icon: '📊' },
                { name: 'My Profile', route: 'studentProfile', icon: '👤' },
                { name: 'Courses', route: 'coursePlayer', icon: '📚' },
                { name: 'Quizzes', route: 'quizInterface', icon: '❓' },
                { name: 'AI Assistant', route: 'aiDashboard', icon: '🤖' },
                { name: 'Live Classroom', route: 'liveClassroom', icon: '📹' },
                { name: 'VR Learning', route: 'vrLearningLab', icon: '🥽' }
            ],
            [this.userRoles.ADMIN]: [
                { name: 'Dashboard', route: 'adminDashboard', icon: '📊' },
                { name: 'Student Management', route: 'adminStudentManagement', icon: '👥' },
                { name: 'Course Management', route: 'courseManagement', icon: '📚' },
                { name: 'Quiz Management', route: 'quizManagement', icon: '❓' },
                { name: 'Order Management', route: 'orderManagement', icon: '🛒' },
                { name: 'Analytics', route: 'aiAnalytics', icon: '📈' },
                { name: 'Certificates', route: 'certificateManager', icon: '🏆' },
                { name: 'Collaboration', route: 'collaborativeWorkspace', icon: '🤝' }
            ]
        };

        return baseMenu[this.currentUserRole] || baseMenu[this.userRoles.GUEST];
    }

    /**
     * Create navigation menu HTML
     */
    createNavigationMenu(containerId = 'navigation-menu') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const menu = this.getNavigationMenu();
        const menuHTML = menu.map(item => `
            <li class="nav-item">
                <a href="#" onclick="navigationManager.navigateTo('${item.route}')" 
                   class="nav-link flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <span class="text-lg">${item.icon}</span>
                    <span class="font-medium">${item.name}</span>
                </a>
            </li>
        `).join('');

        container.innerHTML = `
            <nav class="navigation-menu">
                <ul class="nav-list space-y-2">
                    ${menuHTML}
                </ul>
            </nav>
        `;
    }

    /**
     * Show loading animation
     */
    showLoading() {
        const existingLoader = document.getElementById('navigation-loader');
        if (existingLoader) return;

        const loader = document.createElement('div');
        loader.id = 'navigation-loader';
        loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span class="text-gray-700 dark:text-gray-300">Loading...</span>
            </div>
        `;
        document.body.appendChild(loader);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 5000);
    }

    /**
     * Show access denied message
     */
    showAccessDenied() {
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50';
        message.innerHTML = `
            <div class="flex items-center gap-2">
                <span>🚫</span>
                <span>Access Denied. Please login first.</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">×</button>
            </div>
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 5000);
    }

    /**
     * Set user role
     */
    setUserRole(role) {
        this.currentUserRole = role;
        localStorage.setItem('userRole', role);
        
        // Refresh navigation menu if exists
        const container = document.getElementById('navigation-menu');
        if (container) {
            this.createNavigationMenu();
        }
    }

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('userRole');
        this.currentUserRole = this.userRoles.GUEST;
        this.navigateTo('home');
    }

    /**
     * Get breadcrumb navigation
     */
    getBreadcrumb() {
        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment);
        
        const breadcrumb = [
            { name: 'Home', url: '/' }
        ];

        // Build breadcrumb based on current path
        if (segments.includes('admin')) {
            breadcrumb.push({ name: 'Admin', url: '#' });
            if (segments.includes('dashboard')) {
                breadcrumb.push({ name: 'Dashboard', url: '#' });
            } else if (segments.includes('login')) {
                breadcrumb.push({ name: 'Login', url: '#' });
            }
        } else if (segments.includes('student')) {
            breadcrumb.push({ name: 'Student', url: '#' });
            if (segments.includes('dashboard')) {
                breadcrumb.push({ name: 'Dashboard', url: '#' });
            } else if (segments.includes('profile')) {
                breadcrumb.push({ name: 'Profile', url: '#' });
            }
        }

        return breadcrumb;
    }
}

// Global navigation manager instance
const navigationManager = new NavigationManager();

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create navigation menu if container exists
    navigationManager.createNavigationMenu();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key >= '1' && e.key <= '9') {
            const menu = navigationManager.getNavigationMenu();
            const index = parseInt(e.key) - 1;
            if (menu[index]) {
                navigationManager.navigateTo(menu[index].route);
            }
        }
    });
});

// Export for use in other scripts
window.navigationManager = navigationManager;
