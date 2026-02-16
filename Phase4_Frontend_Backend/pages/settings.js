function renderSettings(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Settings</h1>
            <p>Manage your account and preferences</p>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h2 class="mb-2">Profile Information</h2>
                <form onsubmit="return false;">
                    <div class="form-group">
                        <label for="profileName">Full Name</label>
                        <input type="text" id="profileName" class="form-control" value="John Doe">
                    </div>
                    <div class="form-group">
                        <label for="profileEmail">Email Address</label>
                        <input type="email" id="profileEmail" class="form-control" value="john@example.com">
                    </div>
                    <div class="form-group">
                        <label for="profileTitle">Job Title</label>
                        <input type="text" id="profileTitle" class="form-control" placeholder="e.g., Software Engineer">
                    </div>
                    <button class="btn-primary">Save Changes</button>
                </form>
            </div>

            <div class="card">
                <h2 class="mb-2">Notification Preferences</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <label style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--gray-light); border-radius: var(--border-radius);">
                        <span>Email notifications for new job matches</span>
                        <input type="checkbox" checked>
                    </label>
                    <label style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--gray-light); border-radius: var(--border-radius);">
                        <span>Weekly skill gap analysis reports</span>
                        <input type="checkbox" checked>
                    </label>
                    <label style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; background: var(--gray-light); border-radius: var(--border-radius);">
                        <span>Learning resource recommendations</span>
                        <input type="checkbox">
                    </label>
                </div>
            </div>
        </div>

        <div class="card mt-3" style="border: 1px solid var(--danger);">
            <h2 class="mb-2" style="color: var(--danger);">Danger Zone</h2>
            <p style="color: var(--gray-dark); margin-bottom: 1rem;">Once you delete your account, there is no going back. Please be certain.</p>
            <button class="btn-danger">Delete Account</button>
        </div>
    `;
}
