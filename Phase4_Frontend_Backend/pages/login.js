function renderLogin(container) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <h2>Welcome Back</h2>
                <form id="loginForm" onsubmit="return false;">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" class="form-control" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                            <input type="checkbox" id="remember">
                            Remember me
                        </label>
                    </div>
                    <button type="submit" class="btn-primary w-full">Login</button>
                    <div class="auth-link">
                        Don't have an account? <a href="#/signup">Sign up</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            alert('Login successful! Redirecting to dashboard...');
            window.location.hash = '#/dashboard';
        }
    });
}
