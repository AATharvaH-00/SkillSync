function renderDashboard(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>AI Job Recommendation Dashboard</h1>
            <p>Upload your resume to get personalized job recommendations</p>
        </div>

        <div class="grid grid-3 mb-3">
            <div class="stat-card" style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);">
                <h3>2,847</h3>
                <p>Total Jobs Found</p>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%);">
                <h3>24</h3>
                <p>Skills Matched</p>
            </div>
            <div class="stat-card" style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);">
                <h3>6</h3>
                <p>Recommended Jobs</p>
            </div>
        </div>

        <div class="grid grid-2 mb-3">
            <div class="card glass-card" style="cursor: pointer;" onclick="window.location.hash='#/skills-input'">
                <div style="text-align: center; padding: 2rem;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" style="margin: 0 auto 1rem;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                    </svg>
                    <h2 style="color: var(--dark); margin-bottom: 0.5rem;">Enter Your Skills</h2>
                    <p style="color: var(--gray-dark);">Manually input your skills to get personalized job recommendations based on your expertise.</p>
                    <button class="btn-primary mt-2">Input Skills</button>
                </div>
            </div>

            <div class="card glass-card" style="cursor: pointer;" onclick="window.location.hash='#/resume-analyzer'">
                <div style="text-align: center; padding: 2rem;">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" style="margin: 0 auto 1rem;">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <h2 style="color: var(--dark); margin-bottom: 0.5rem;">Analyze Your Resume</h2>
                    <p style="color: var(--gray-dark);">Paste your resume text and let AI extract skills automatically for job matching.</p>
                    <button class="btn-primary mt-2">Analyze Resume</button>
                </div>
            </div>
        </div>

        <div class="card">
            <h2 style="margin-bottom: 1.5rem;">How SkillSync Works</h2>
            <div class="grid grid-2">
                <div style="padding: 1.5rem; background: var(--gray-light); border-radius: var(--border-radius);">
                    <div style="width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">1</div>
                    <h3 style="margin-bottom: 0.5rem;">Input Skills</h3>
                    <p style="color: var(--gray-dark);">Enter skills or upload resume</p>
                </div>
                <div style="padding: 1.5rem; background: var(--gray-light); border-radius: var(--border-radius);">
                    <div style="width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">2</div>
                    <h3 style="margin-bottom: 0.5rem;">AI Processing</h3>
                    <p style="color: var(--gray-dark);">Skills extraction and matching</p>
                </div>
                <div style="padding: 1.5rem; background: var(--gray-light); border-radius: var(--border-radius);">
                    <div style="width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">3</div>
                    <h3 style="margin-bottom: 0.5rem;">Job Matching</h3>
                    <p style="color: var(--gray-dark);">Find best matching jobs</p>
                </div>
                <div style="padding: 1.5rem; background: var(--gray-light); border-radius: var(--border-radius);">
                    <div style="width: 48px; height: 48px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">4</div>
                    <h3 style="margin-bottom: 0.5rem;">Skill Gap Analysis</h3>
                    <p style="color: var(--gray-dark);">Identify areas to improve</p>
                </div>
            </div>
        </div>
    `;
}
