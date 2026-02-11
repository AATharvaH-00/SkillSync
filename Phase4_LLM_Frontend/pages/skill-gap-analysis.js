function renderSkillGapAnalysis(container) {
    const skillsData = [
        { name: 'Python', level: 95, status: 'matched' },
        { name: 'JavaScript', level: 88, status: 'matched' },
        { name: 'React', level: 82, status: 'matched' },
        { name: 'SQL', level: 78, status: 'matched' },
        { name: 'Docker', level: 65, status: 'matched' },
        { name: 'TensorFlow', level: 60, status: 'matched' },
        { name: 'Kubernetes', level: 25, status: 'develop' },
        { name: 'MLOps', level: 15, status: 'develop' },
        { name: 'Apache Spark', level: 10, status: 'develop' },
        { name: 'FastAPI', level: 5, status: 'develop' }
    ];

    const matchedSkills = skillsData.filter(s => s.status === 'matched');
    const developSkills = skillsData.filter(s => s.status === 'develop');

    container.innerHTML = `
        <div class="page-header">
            <h1>Skill Gap Analysis</h1>
            <p>Identify missing skills and learn to develop them for better jobs</p>
        </div>

        <div class="grid grid-3 mb-3">
            <div class="card" style="background: var(--success); color: white;">
                <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${matchedSkills.length}</h3>
                <p>Skills You Have</p>
            </div>
            <div class="card" style="background: var(--warning); color: white;">
                <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${developSkills.length}</h3>
                <p>Skills to Develop</p>
            </div>
            <div class="card" style="background: var(--primary); color: white;">
                <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">0</h3>
                <p>In Learning Plan</p>
            </div>
        </div>

        <div class="card mb-3">
            <h2 class="mb-2">Skill Match Analysis</h2>
            <p style="color: var(--gray-dark); margin-bottom: 1.5rem;">
                <span style="color: var(--success); font-weight: 600;">Green</span> = Matched skills, 
                <span style="color: var(--danger); font-weight: 600;">Red</span> = Skills to develop
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${skillsData.map(skill => `
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <strong>${skill.name}</strong>
                            <span style="color: var(--gray-medium);">${skill.level}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${skill.level}%; background: ${skill.status === 'matched' ? 'linear-gradient(90deg, #10B981 0%, #059669 100%)' : 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)'};"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card">
            <h2 class="mb-2">Skills to Develop for Better Jobs</h2>
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
                ${[
            {
                name: 'MLOps',
                priority: 'High Priority',
                description: 'Required by 78% of ML Engineer jobs',
                resources: [
                    { name: 'MLOps Fundamentals (Coursera)', url: '#' },
                    { name: 'MLflow Documentation', url: '#' }
                ]
            },
            {
                name: 'Kubernetes',
                priority: 'High Priority',
                description: 'Essential for deploying ML models at scale',
                resources: [
                    { name: 'Kubernetes Basics (Official)', url: '#' },
                    { name: 'K8s for ML Engineers', url: '#' }
                ]
            },
            {
                name: 'Apache Spark',
                priority: 'Medium Priority',
                description: 'Growing demand in GenAI roles',
                resources: [
                    { name: 'Apache Spark Documentation', url: '#' },
                    { name: 'PySpark Tutorial', url: '#' }
                ]
            },
            {
                name: 'FastAPI',
                priority: 'Medium Priority',
                description: 'Modern Python web framework for ML APIs',
                resources: [
                    { name: 'FastAPI Official Tutorial', url: '#' },
                    { name: 'Building ML APIs with FastAPI', url: '#' }
                ]
            }
        ].map(skill => `
                    <div style="padding: 1.5rem; background: var(--gray-light); border-radius: var(--border-radius); border-left: 4px solid var(--primary);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                            <div>
                                <h3 style="margin-bottom: 0.5rem;">${skill.name}</h3>
                                <span class="tag ${skill.priority.includes('High') ? 'danger' : 'warning'}" style="background: ${skill.priority.includes('High') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${skill.priority.includes('High') ? 'var(--danger)' : 'var(--warning)'};">
                                    ${skill.priority}
                                </span>
                            </div>
                            <button class="btn-primary">Add to Plan</button>
                        </div>
                        <p style="color: var(--gray-dark); margin-bottom: 1rem;">${skill.description}</p>
                        <div>
                            <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--gray-dark);">Learning Resources:</strong>
                            <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                ${skill.resources.map(resource => `
                                    <a href="${resource.url}" style="color: var(--primary); text-decoration: none; font-size: 0.875rem;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                                        ${resource.name} →
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
