function renderSignup(container) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                </div>
                <h2>Create Your Account</h2>
                <p class="auth-subtitle">Start getting AI-powered job recommendations today</p>
                <div id="signupError" class="form-error" style="display:none;"></div>
                <form id="signupForm" onsubmit="return false;">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" class="form-control" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail">Email Address</label>
                        <input type="email" id="signupEmail" class="form-control" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" class="form-control" placeholder="Create a password" required>
                        <small style="color: var(--gray-medium); font-size: 0.875rem;">Must be at least 8 characters</small>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="form-control" placeholder="Re-enter your password" required>
                    </div>
                    <button type="submit" id="signupBtn" class="btn-primary w-full">Create Account</button>
                    <div class="auth-link">
                        Already have an account? <a href="#/login">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorBox = document.getElementById('signupError');
        const btn = document.getElementById('signupBtn');

        errorBox.style.display = 'none';

        if (!fullName || !email || !password || !confirmPassword) {
            errorBox.textContent = 'Please fill in all fields.';
            errorBox.style.display = 'block';
            return;
        }
        if (password.length < 8) {
            errorBox.textContent = 'Password must be at least 8 characters.';
            errorBox.style.display = 'block';
            return;
        }
        if (password !== confirmPassword) {
            errorBox.textContent = 'Passwords do not match. Please try again.';
            errorBox.style.display = 'block';
            return;
        }

        btn.textContent = 'Creating account...';
        btn.disabled = true;

        setTimeout(() => {
            // Auto-login after signup
            Auth.login(fullName, email);
            updateNavbar();
            showToast('Account created successfully! Welcome to SkillSync 🎉', 'success');
            window.location.hash = '#/dashboard';
        }, 600);
    });
}
