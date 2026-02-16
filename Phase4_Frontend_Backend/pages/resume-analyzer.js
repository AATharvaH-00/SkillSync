function renderResumeAnalyzer(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Resume Analyzer</h1>
            <p>Paste your resume to extract skills and get job recommendations</p>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h2 class="mb-2">Resume Analyzer</h2>
                <p style="color: var(--gray-dark); margin-bottom: 1rem;">Paste your resume content below to extract skills</p>
                
                <div class="form-group">
                    <label for="resumeText">Resume Text</label>
                    <textarea id="resumeText" class="form-control" placeholder="Paste your resume content here..." style="min-height: 300px;"></textarea>
                </div>

                <button class="btn-primary w-full" onclick="analyzeResume()">Analyze Resume</button>

                <div id="analysisResults" class="mt-3" style="display: none;">
                    <h3 style="color: var(--success); margin-bottom: 1rem;">Extracted Skills</h3>
                    <div id="extractedSkills" style="display: flex; flex-wrap: wrap; gap: 0.5rem;"></div>
                    <button class="btn-success w-full mt-2" onclick="window.location.hash='#/job-recommendations'">View Job Recommendations</button>
                </div>
            </div>

            <div class="card glass-card">
                <h3 class="mb-2">Analyze Your Resume</h3>
                <p style="color: var(--gray-dark); line-height: 1.8; margin-bottom: 1.5rem;">
                    Paste your resume text and click "Analyze Resume" to see extracted skills
                </p>
                
                <div style="background: var(--gray-light); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
                    <h4 style="margin-bottom: 0.5rem;">Instructions</h4>
                    <ol style="color: var(--gray-dark); line-height: 1.8; margin-left: 1.25rem;">
                        <li>Copy your resume text</li>
                        <li>Paste it in the text area</li>
                        <li>Click "Analyze Resume"</li>
                        <li>Review extracted skills</li>
                        <li>Get job recommendations</li>
                    </ol>
                </div>
            </div>
        </div>
    `;

    window.analyzeResume = function () {
        const resumeText = document.getElementById('resumeText').value.trim();

        if (!resumeText) {
            alert('Please paste your resume text!');
            return;
        }

        const mockSkills = [
            'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB',
            'Machine Learning', 'Data Analysis', 'Git', 'Docker',
            'Communication', 'Leadership', 'Problem Solving'
        ];

        const extractedSkills = mockSkills.filter(() => Math.random() > 0.5).slice(0, 8);

        const resultsDiv = document.getElementById('analysisResults');
        const skillsDiv = document.getElementById('extractedSkills');

        skillsDiv.innerHTML = extractedSkills.map(skill =>
            `<span class="tag success">${skill}</span>`
        ).join('');

        resultsDiv.style.display = 'block';
    };
}
