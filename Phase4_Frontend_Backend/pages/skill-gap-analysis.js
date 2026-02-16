async function renderSkillGapAnalysis(container) {
    const storedSkills = localStorage.getItem('userSkills');
    const userSkills = storedSkills ? JSON.parse(storedSkills) : [];

    if (userSkills.length === 0) {
        container.innerHTML = `
            <div class="page-header">
                <h1>Skill Gap Analysis</h1>
            </div>
            <div class="card" style="text-align: center; padding: 3rem;">
                <h3>No skills found</h3>
                <p>Please go back to the <a href="#/skills-input">Skills Input</a> page to add your skills to see your gap analysis.</p>
                <button class="btn-primary" onclick="window.location.hash='#/skills-input'">Add Skills</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="page-header">
            <h1>Skill Gap Analysis</h1>
            <p>Identify missing skills and learn to develop them for better jobs</p>
        </div>
        
        <div id="gap-analysis-loading" class="card glass-card" style="text-align: center; padding: 3rem;">
            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p>Analyzing your skill profile against market demands...</p>
            <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
        </div>
        <div id="gap-analysis-content" style="display: none;"></div>
    `;

    try {
        // Fetch recommendations to get the missing skills data
        const response = await fetch('http://localhost:8000/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: userSkills })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        const recommendations = data.recommendations;

        // --- Process Data for Gap Analysis ---

        // 1. Matched Skills (The ones the user has)
        // In a real app, we might check which of the user's skills specifically matched the jobs,
        // but for now, we assume all user skills are "possessed" assets.
        const matchedSkillsData = userSkills.map(skill => ({
            name: skill,
            level: 100, // Assumed level for simple UI
            status: 'matched'
        }));

        // 2. Identify Top Missing Skills (Skills to Develop)
        // Aggregate missing skills from all recommendations
        const missingSkillCounts = {};
        recommendations.forEach(job => {
            if (job['Missing Skills']) {
                job['Missing Skills'].forEach(skill => {
                    missingSkillCounts[skill] = (missingSkillCounts[skill] || 0) + 1;
                });
            }
        });

        // Convert to array and sort by frequency
        const skillsToDevelopData = Object.entries(missingSkillCounts)
            .map(([name, count]) => ({
                name: name,
                frequency: count,
                status: 'develop',
                // Calculate a "priority" based on frequency relative to total recommendations
                priority: count > (recommendations.length * 0.5) ? 'High Priority' : 'Medium Priority',
                description: `Required by ${Math.round((count / recommendations.length) * 100)}% of your recommended jobs`
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5); // Take top 5

        // Combine for the chart list
        const allSkillsForChart = [...matchedSkillsData, ...skillsToDevelopData.map(s => ({ ...s, level: 0 }))];

        // Render Content
        const contentDiv = document.getElementById('gap-analysis-content');
        contentDiv.style.display = 'block';
        document.getElementById('gap-analysis-loading').style.display = 'none';

        contentDiv.innerHTML = `
            <div class="grid grid-3 mb-3">
                <div class="card" style="background: var(--success); color: white;">
                    <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${matchedSkillsData.length}</h3>
                    <p>Skills You Have</p>
                </div>
                <div class="card" style="background: var(--warning); color: white;">
                    <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${skillsToDevelopData.length}</h3>
                    <p>Skills to Develop</p>
                </div>
                <div class="card" style="background: var(--primary); color: white;">
                    <h3 style="font-size: 2.5rem; margin-bottom: 0.5rem;">${skillsToDevelopData.length > 0 ? 'Active' : 'None'}</h3>
                    <p>Learning Status</p>
                </div>
            </div>

            <div class="card mb-3">
                <h2 class="mb-2">Skill Match Analysis</h2>
                <p style="color: var(--gray-dark); margin-bottom: 1.5rem;">
                    <span style="color: var(--success); font-weight: 600;">Green</span> = Your Skills, 
                    <span style="color: var(--danger); font-weight: 600;">Red</span> = Recommended to Learn
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${matchedSkillsData.map(skill => `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <strong>${skill.name}</strong>
                                <span style="color: var(--gray-medium);">Matched</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%; background: linear-gradient(90deg, #10B981 0%, #059669 100%);"></div>
                            </div>
                        </div>
                    `).join('')}
                    ${skillsToDevelopData.map(skill => `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <strong>${skill.name}</strong>
                                <span style="color: var(--danger);">Missing</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.max(10, (skill.frequency / recommendations.length) * 100)}%; background: linear-gradient(90deg, #EF4444 0%, #DC2626 100%);"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="card">
                <h2 class="mb-2">Skills to Develop for Better Jobs</h2>
                <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem;">
                    ${skillsToDevelopData.length > 0 ? skillsToDevelopData.map(skill => `
                        <div style="padding: 1.5rem; background: var(--gray-light); border-radius: var(--border-radius); border-left: 4px solid var(--primary);">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                <div>
                                    <h3 style="margin-bottom: 0.5rem;">${skill.name}</h3>
                                    <span class="tag ${skill.priority.includes('High') ? 'danger' : 'warning'}" style="background: ${skill.priority.includes('High') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'}; color: ${skill.priority.includes('High') ? 'var(--danger)' : 'var(--warning)'};">
                                        ${skill.priority}
                                    </span>
                                </div>
                                <button class="btn-primary" onclick="alert('Added ${skill.name} to learning plan!')">Add to Plan</button>
                            </div>
                            <p style="color: var(--gray-dark); margin-bottom: 1rem;">${skill.description}</p>
                            <div>
                                <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--gray-dark);">Recommended Actions:</strong>
                                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                                    <a href="https://www.google.com/search?q=learn+${encodeURIComponent(skill.name)}" target="_blank" style="color: var(--primary); text-decoration: none; font-size: 0.875rem;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
                                        Search for ${skill.name} tutorials →
                                    </a>
                                </div>
                            </div>
                        </div>
                    `).join('') : `
                        <div style="padding: 2rem; text-align: center; color: var(--gray-dark);">
                            <p>Great job! You have a high match rate with recommended jobs.</p>
                        </div>
                    `}
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Gap Analysis Error:', error);
        container.innerHTML += `
            <div class="card" style="border-left: 4px solid var(--danger);">
                <h3 style="color: var(--danger);">Analysis Failed</h3>
                <p>Could not connect to the recommendation engine to analyze skill gaps.</p>
                <code style="display: block; background: #f5f5f5; padding: 0.5rem; margin-top: 0.5rem;">${error.message}</code>
            </div>
        `;
        document.getElementById('gap-analysis-loading').style.display = 'none';
    }
}
