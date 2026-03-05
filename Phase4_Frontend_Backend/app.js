// Routes
const routes = {
    '/': renderDashboard,
    '/dashboard': renderDashboard,
    '/login': renderLogin,
    '/signup': renderSignup,
    '/skills-input': renderSkillsInput,
    '/resume-analyzer': renderResumeAnalyzer,
    '/job-recommendations': renderJobRecommendations,
    '/skill-gap-analysis': renderSkillGapAnalysis,
    '/settings': renderSettings
};

// Routes that require authentication
const PROTECTED_ROUTES = new Set([
    '/skills-input',
    '/resume-analyzer',
    '/job-recommendations',
    '/skill-gap-analysis',
    '/settings'
]);

function navigateTo(hash) {
    window.location.hash = hash;
}

function updateActiveNav(path) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const page = item.getAttribute('data-page');
        if (page && path.includes(page)) {
            item.classList.add('active');
        }
    });
}

/**
 * Update navbar based on auth state.
 * Shows user name + Logout when logged in, Login/Sign Up when logged out.
 */
function updateNavbar() {
    const navbarActions = document.querySelector('.navbar-actions');
    if (!navbarActions) return;

    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        navbarActions.innerHTML = `
            <div class="navbar-user">
                <div class="user-avatar">${user.name.charAt(0).toUpperCase()}</div>
                <span class="user-name">${user.name}</span>
            </div>
            <button class="btn-danger btn-sm" id="logoutBtn">Logout</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            Auth.logout();
            showToast('You have been signed out. See you soon! 👋');
            updateNavbar();
            window.location.hash = '#/login';
        });
    } else {
        navbarActions.innerHTML = `
            <button class="btn-secondary" onclick="navigateTo('#/login')">Login</button>
            <button class="btn-primary" onclick="navigateTo('#/signup')">Sign Up</button>
        `;
    }
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'info'|'success'|'warning'} type
 */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.getElementById('skillsync-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'skillsync-toast';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { toast.classList.add('toast-show'); });
    });

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function router() {
    const hash = window.location.hash;
    // Strip ?redirect=... from path
    const path = (hash.slice(1).split('?')[0]) || '/';

    const contentArea = document.getElementById('content');
    const route = routes[path] || routes['/'];

    // Auth guard: redirect unauthenticated users away from protected routes
    if (PROTECTED_ROUTES.has(path) && !Auth.isLoggedIn()) {
        const redirectParam = `?redirect=${encodeURIComponent('#' + path)}`;
        window.location.hash = `#/login${redirectParam}`;
        showToast('Please log in to access this feature 🔒', 'warning');
        return;
    }

    if (route) {
        contentArea.innerHTML = '';
        route(contentArea);
        updateActiveNav(path);
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    updateNavbar();
    router();
});

window.navigateTo = navigateTo;
window.showToast = showToast;
window.updateNavbar = updateNavbar;
