function renderSignup(container) {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <h2>Create Account</h2>
                <form id="signupForm" onsubmit="return false;">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" class="form-control" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" class="form-control" placeholder="your@email.com" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Create a password" required>
                        <small style="color: var(--gray-medium); font-size: 0.875rem;">Must be at least 8 characters</small>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" class="form-control" placeholder="Re-enter password" required>
                    </div>
                    <button type="submit" class="btn-primary w-full">Create Account</button>
                    <div class="auth-link">
                        Already have an account? <a href="#/login">Login</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters!');
            return;
        }

        if (fullName && email && password) {
            alert('Account created successfully! Please login.');
            window.location.hash = '#/login';
        }
    });
}
