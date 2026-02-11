function renderSkillsInput(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Skills-Based Job Recommendation</h1>
            <p>Enter your skills to find matching jobs</p>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h2 class="mb-2">Add Your Skills</h2>
                <div class="form-group">
                    <input type="text" id="skillInput" class="form-control" placeholder="Type a skill (e.g., Python, React)..." onkeypress="handleSkillInput(event)">
                </div>
                
                <div class="mb-2">
                    <p style="font-weight: 600; color: var(--gray-dark); margin-bottom: 0.75rem;">Quick Add:</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        <button class="tag primary" onclick="addSkill('Python')" style="cursor: pointer; border: none;">Python</button>
                        <button class="tag primary" onclick="addSkill('JavaScript')" style="cursor: pointer; border: none;">JavaScript</button>
                        <button class="tag primary" onclick="addSkill('React')" style="cursor: pointer; border: none;">React</button>
                        <button class="tag primary" onclick="addSkill('Node.js')" style="cursor: pointer; border: none;">Node.js</button>
                        <button class="tag primary" onclick="addSkill('SQL')" style="cursor: pointer; border: none;">SQL</button>
                    </div>
                </div>

                <div id="skillsList" class="mb-2" style="display: flex; flex-wrap: wrap; gap: 0.5rem; min-height: 50px; padding: 1rem; background: var(--gray-light); border-radius: var(--border-radius);">
                </div>

                <button class="btn-primary w-full" onclick="getRecommendations()">Get Job Recommendations</button>
            </div>

            <div class="card glass-card">
                <h3 class="mb-2">Tips for Better Results</h3>
                <ul style="color: var(--gray-dark); line-height: 1.8;">
                    <li>Add specific technical skills (Python, React, SQL)</li>
                    <li>Include tools you're familiar with (Git, Docker, AWS)</li>
                    <li>Add soft skills too (Communication, Leadership)</li>
                    <li>More skills = better matching accuracy</li>
                </ul>
            </div>
        </div>
    `;

    const skills = new Set();

    window.addSkill = function (skill) {
        if (skill && !skills.has(skill)) {
            skills.add(skill);
            updateSkillsList();
        }
    };

    window.removeSkill = function (skill) {
        skills.delete(skill);
        updateSkillsList();
    };

    window.handleSkillInput = function (event) {
        if (event.key === 'Enter') {
            const input = document.getElementById('skillInput');
            const skill = input.value.trim();
            if (skill) {
                addSkill(skill);
                input.value = '';
            }
        }
    };

    window.getRecommendations = function () {
        if (skills.size === 0) {
            alert('Please add at least one skill!');
            return;
        }
        window.location.hash = '#/job-recommendations';
    };

    function updateSkillsList() {
        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = skills.size === 0
            ? '<p style="color: var(--gray-medium); margin: 0;">No skills added yet</p>'
            : Array.from(skills).map(skill => `
                <span class="tag success">
                    ${skill}
                    <span class="remove" onclick="removeSkill('${skill}')" style="cursor: pointer;">×</span>
                </span>
            `).join('');
    }

    updateSkillsList();
}
