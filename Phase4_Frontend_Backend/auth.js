/**
 * SkillSync Auth Module
 * Manages client-side authentication state via localStorage.
 */
const Auth = (() => {
    const SESSION_KEY = 'skillsync_user';

    function login(name, email) {
        const user = { name, email, loginTime: Date.now() };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    }

    function logout() {
        localStorage.removeItem(SESSION_KEY);
    }

    function isLoggedIn() {
        return !!localStorage.getItem(SESSION_KEY);
    }

    function getUser() {
        const raw = localStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    return { login, logout, isLoggedIn, getUser };
})();

window.Auth = Auth;
