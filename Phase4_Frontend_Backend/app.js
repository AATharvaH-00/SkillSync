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

function router() {
    let path = window.location.hash.slice(1) || '/';

    const contentArea = document.getElementById('content');
    const route = routes[path] || routes['/'];

    if (route) {
        contentArea.innerHTML = '';
        route(contentArea);
        updateActiveNav(path);
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

window.navigateTo = navigateTo;
