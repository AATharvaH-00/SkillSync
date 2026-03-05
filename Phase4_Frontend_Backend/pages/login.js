function renderLogin(container) {
    // Check if there's a redirect param
    const hashParts = window.location.hash.split('?redirect=');
    const redirectTo = hashParts.length > 1 ? decodeURIComponent(hashParts[1]) : '#/dashboard';

    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <h2>Welcome Back</h2>
                <p class="auth-subtitle">Sign in to access your personalized job matches</p>
                <div id="loginError" class="form-error" style="display:none;"></div>
                <form id="loginForm" onsubmit="return false;">
                    <div class="form-group">
                        <label for="loginEmail">Email Address</label>
                        <input type="email" id="loginEmail" class="form-control" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="Enter your password" required>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal; cursor: pointer;">
                            <input type="checkbox" id="remember">
                            Remember me
                        </label>
                    </div>
                    <button type="submit" id="loginBtn" class="btn-primary w-full">Sign In</button>
                    <div class="auth-link">
                        Don't have an account? <a href="#/signup">Create one free</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const errorBox = document.getElementById('loginError');
        const btn = document.getElementById('loginBtn');

        // Basic validation
        if (!email || !password) {
            errorBox.textContent = 'Please fill in all fields.';
            errorBox.style.display = 'block';
            return;
        }
        if (password.length < 6) {
            errorBox.textContent = 'Password must be at least 6 characters.';
            errorBox.style.display = 'block';
            return;
        }

        errorBox.style.display = 'none';

        // Simulate login — save session
        btn.textContent = 'Signing in...';
        btn.disabled = true;

        setTimeout(() => {
            const name = email.split('@')[0];
            Auth.login(name.charAt(0).toUpperCase() + name.slice(1), email);
            updateNavbar();
            showToast('Welcome back! You are now signed in. ✅', 'success');
            window.location.hash = redirectTo;
        }, 500);
    });
}
