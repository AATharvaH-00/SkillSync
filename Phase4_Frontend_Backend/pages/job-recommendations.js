async function renderJobRecommendations(container) {
    // 1. Get user skills from local storage
    const storedSkills = localStorage.getItem('userSkills');
    const skills = storedSkills ? JSON.parse(storedSkills) : [];

    // Basic Layout Structure
    container.innerHTML = `
        <div class="page-header">
            <h1>Job Recommendations</h1>
            <p>Browse jobs matched to your skills: <strong>${skills.join(', ') || 'No skills selected'}</strong></p>
        </div>

        <div style="display: flex; gap: 2rem;">
            <!-- Sidebar Filters (Visual only for now) -->
            <div style="width: 280px; flex-shrink: 0;">
                <div class="card">
                    <h3 class="mb-2">Filters</h3>
                    <div class="form-group">
                        <label>Location</label>
                        <select class="form-control" id="locationFilter">
                            <option value="">All Locations</option>
                            <option value="SF">San Francisco</option>
                            <option value="NY">New York</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                            <input type="checkbox" id="remoteOnly">
                            Remote Only
                        </label>
                    </div>
                </div>
            </div>

            <!-- Job List Area -->
            <div style="flex: 1;" id="jobListContainer">
                <div class="card glass-card" style="text-align: center; padding: 3rem;">
                    <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p>Finding the perfect jobs for you...</p>
                    <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
                </div>
            </div>
        </div>
    `;

    if (skills.length === 0) {
        document.getElementById('jobListContainer').innerHTML = `
            <div class="card" style="text-align: center; padding: 3rem;">
                <h3>No skills found</h3>
                <p>Please go back to the <a href="#/skills-input">Skills Input</a> page to add your skills.</p>
                <button class="btn-primary" onclick="window.location.hash='#/skills-input'">Add Skills</button>
            </div>
        `;
        return;
    }

    try {
        // 2. Fetch recommendations from API
        const response = await fetch('http://localhost:8000/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skills: skills })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const jobs = data.recommendations;

        // 3. Render Jobs
        const jobListContainer = document.getElementById('jobListContainer');

        if (jobs.length === 0) {
            jobListContainer.innerHTML = `
                <div class="card">
                    <h3>No matches found</h3>
                    <p>Try adding more diverse skills to your profile.</p>
                </div>
            `;
            return;
        }

        jobListContainer.innerHTML = `
            <div style="background: white; padding: 1.25rem; border-radius: var(--border-radius); margin-bottom: 1.5rem; box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0;">Top Matches</h3>
                    <p style="color: var(--gray-dark); margin: 0;">${jobs.length} jobs found for your profile</p>
                </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                ${jobs.map(job => renderJobCard(job)).join('')}
            </div>
        `;

    } catch (error) {
        console.error('Failed to fetch jobs:', error);
        document.getElementById('jobListContainer').innerHTML = `
            <div class="card" style="border-left: 4px solid var(--danger);">
                <h3 style="color: var(--danger);">Connection Error</h3>
                <p>Could not connect to the recommendation engine. Is the backend server running?</p>
                <code style="display: block; background: #f5f5f5; padding: 0.5rem; margin-top: 0.5rem;">${error.message}</code>
                <button class="btn-outline" style="margin-top: 1rem;" onclick="renderJobRecommendations(document.querySelector('#app'))">Try Again</button>
            </div>
        `;
    }
}

function renderJobCard(job) {
    // Parse "95%" -> 95
    const scoreVal = parseInt(job['Match Score']);
    const scoreColor = scoreVal >= 80 ? 'var(--success)' : (scoreVal >= 50 ? 'var(--warning)' : 'var(--danger)');

    return `
        <div class="job-card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h3>${job['Job Title']}</h3>
                    <p class="company" style="font-weight: 600; color: var(--primary);">${job['Company']}</p>
                </div>
                <div class="match-score" style="flex-direction: column; align-items: flex-end; gap: 0.25rem;">
                    <span style="font-size: 1.25rem; font-weight: 700; color: ${scoreColor};">${job['Match Score']}</span>
                    <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--gray-dark);">Match</span>
                </div>
            </div>
            
            <div style="margin: 1rem 0;">
                <div class="progress-bar" style="height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                    <div style="width: ${scoreVal}%; height: 100%; background: ${scoreColor}; transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--gray-dark);">Required Skills:</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${job['Required Skills'].map(skill => `<span class="tag primary">${skill}</span>`).join('')}
                </div>
            </div>

            ${job['Missing Skills'] && job['Missing Skills'].length > 0 ? `
            <div style="margin-bottom: 1rem; background: #fff5f5; padding: 0.75rem; border-radius: 6px; border: 1px solid #ffebeb;">
                <strong style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; color: var(--danger);">Missing Skills (Gap Analysis):</strong>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${job['Missing Skills'].map(skill => `<span class="tag" style="background: white; border: 1px solid var(--danger); color: var(--danger);">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button class="btn-primary">Apply Now</button>
                <button class="btn-outline">View details</button>
            </div>
        </div>
    `;
}
