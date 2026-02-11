function renderJobRecommendations(container) {
    const mockJobs = [
        {
            id: 1,
            title: 'Senior Machine Learning Engineer',
            company: 'TechVision AI',
            location: 'San Francisco, CA',
            remote: true,
            matchScore: 92,
            skills: ['Python', 'TensorFlow', 'ML Ops']
        },
        {
            id: 2,
            title: 'AI Research Scientist',
            company: 'DeepMind Labs',
            location: 'New York, NY',
            remote: true,
            matchScore: 87,
            skills: ['Python', 'Deep Learning', 'NLP']
        },
        {
            id: 3,
            title: 'Full Stack Developer',
            company: 'Innovative Systems',
            location: 'Austin, TX',
            remote: false,
            matchScore: 85,
            skills: ['JavaScript', 'React', 'Node.js']
        },
        {
            id: 4,
            title: 'Data Engineer',
            company: 'DataFlow Inc',
            location: 'Seattle, WA',
            remote: true,
            matchScore: 82,
            skills: ['Python', 'SQL', 'Apache Spark']
        },
        {
            id: 5,
            title: 'DevOps Engineer',
            company: 'CloudTech Solutions',
            location: 'Remote',
            remote: true,
            matchScore: 78,
            skills: ['Docker', 'Kubernetes', 'AWS']
        },
        {
            id: 6,
            title: 'Frontend Developer',
            company: 'UI Masters',
            location: 'Boston, MA',
            remote: false,
            matchScore: 75,
            skills: ['React', 'TypeScript', 'CSS']
        }
    ];

    container.innerHTML = `
        <div class="page-header">
            <h1>Job Recommendations</h1>
            <p>Browse jobs matched to your skills</p>
        </div>

        <div style="display: flex; gap: 2rem;">
            <div style="width: 280px; flex-shrink: 0;">
                <div class="card">
                    <h3 class="mb-2">Filters</h3>
                    
                    <div class="form-group">
                        <label>Location</label>
                        <select class="form-control" id="locationFilter">
                            <option value="">All Locations</option>
                            <option value="SF">San Francisco</option>
                            <option value="NY">New York</option>
                            <option value="TX">Austin</option>
                            <option value="WA">Seattle</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-weight: normal;">
                            <input type="checkbox" id="remoteOnly">
                            Remote Only
                        </label>
                    </div>

                    <div class="form-group">
                        <label>Experience Level</label>
                        <select class="form-control" id="experienceFilter">
                            <option value="">All Levels</option>
                            <option value="entry">Entry Level</option>
                            <option value="mid">Mid Level</option>
                            <option value="senior">Senior Level</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style="flex: 1;">
                <div style="background: white; padding: 1.25rem; border-radius: var(--border-radius); margin-bottom: 1.5rem; box-shadow: var(--shadow-sm);">
                    <h3>Job Recommendations</h3>
                    <p style="color: var(--gray-dark);">${mockJobs.length} jobs matched to your profile</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    ${mockJobs.map(job => `
                        <div class="job-card">
                            <h3>${job.title}</h3>
                            <p class="company">${job.company}</p>
                            <p class="location">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle;">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                ${job.location} ${job.remote ? '• Remote' : ''}
                            </p>

                            <div class="match-score">
                                <span>Match Score</span>
                                <div class="progress-bar" style="flex: 1;">
                                    <div class="progress-fill" style="width: ${job.matchScore}%;"></div>
                                </div>
                                <span>${job.matchScore}%</span>
                            </div>

                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem;">
                                <strong style="color: var(--gray-dark); font-size: 0.875rem;">Required Skills:</strong>
                                ${job.skills.map(skill => `<span class="tag primary">${skill}</span>`).join('')}
                            </div>

                            <div style="display: flex; gap: 1rem;">
                                <button class="btn-outline">View Details</button>
                                <button class="btn-primary">Apply</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}
