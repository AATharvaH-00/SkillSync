function renderResumeAnalyzer(container) {
    container.innerHTML = `
        <div class="page-header">
            <h1>Resume Analyzer</h1>
            <p>Paste your resume to extract skills and get job recommendations</p>
        </div>

        <div class="grid grid-2">
            <div class="card">
                <h2 class="mb-2">Resume Analyzer</h2>
                <p style="color: var(--gray-dark); margin-bottom: 1rem;">Upload your resume PDF or paste your resume content below to extract skills</p>
                
                <div class="form-group">
                    <label for="resumeFile">Upload Resume (PDF/DOCX)</label>
                    <input type="file" id="resumeFile" class="form-control" accept=".pdf,.docx">
                </div>
                
                <div class="form-group mt-2">
                    <label for="resumeText">Or Paste Resume Text</label>
                    <textarea id="resumeText" class="form-control" placeholder="Paste your resume content here..." style="min-height: 200px;"></textarea>
                </div>

                <button id="analyzeBtn" class="btn-primary w-full mt-2" onclick="analyzeResume()">Analyze Resume</button>

                <div id="analysisResults" class="mt-3 card glass-card" style="display: none; text-align: left;">
                    <details open style="margin-bottom: 1rem;">
                        <summary style="font-weight: bold; font-size: 1.1rem; cursor: pointer; color: var(--primary);">RESULTS DISPLAY</summary>
                        
                        <div style="margin-top: 1rem;">
                            <h4 style="color: var(--gray-dark); margin-bottom: 0.5rem; font-size: 0.9rem;">RESUME SUMMARY</h4>
                            <p id="resSummary" style="font-style: italic; margin-bottom: 1rem; line-height: 1.5;"></p>
                            
                            <h4 style="color: var(--gray-dark); margin-bottom: 0.5rem; font-size: 0.9rem;">YOUR SKILLS</h4>
                            <div id="resSkills" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;"></div>
                            
                            <h4 style="color: var(--gray-dark); margin-bottom: 0.5rem; font-size: 0.9rem;">TOP ROLES</h4>
                            <p id="resRoles" style="font-weight: bold; color: var(--secondary); margin-bottom: 1rem;"></p>
                            
                            <h4 style="color: var(--gray-dark); margin-bottom: 0.5rem; font-size: 0.9rem;">SKILL GAPS</h4>
                            <ul id="resGaps" style="list-style-type: none; margin-bottom: 1rem; color: var(--danger);"></ul>
                            
                            <h4 style="color: var(--gray-dark); margin-bottom: 0.5rem; font-size: 0.9rem;">TOP JOBS</h4>
                            <ul id="resJobs" style="list-style-type: disc; margin-left: 1.25rem; margin-bottom: 1rem;"></ul>
                            
                            <h4 style="color: var(--gray-dark); margin-bottom: 0.5rem; font-size: 0.9rem;">3-MONTH ROADMAP</h4>
                            <ul id="resRoadmap" style="list-style-type: decimal; margin-left: 1.25rem; margin-bottom: 1rem; color: var(--success);"></ul>
                        </div>
                    </details>
                    
                    <button class="btn-success w-full mt-2" onclick="window.location.hash='#/job-recommendations'">View Job Recommendations</button>
                </div>
            </div>

            <div class="card glass-card" style="height: fit-content;">
                <h3 class="mb-2">Analyze Your Resume</h3>
                <p style="color: var(--gray-dark); line-height: 1.8; margin-bottom: 1.5rem;">
                    Upload your resume or paste the text. Our AI will analyze your profile and match you with the best opportunities.
                </p>
                
                <div style="background: var(--gray-light); padding: 1rem; border-radius: var(--border-radius); margin-bottom: 1rem;">
                    <h4 style="margin-bottom: 0.5rem;">Instructions</h4>
                    <ol style="color: var(--gray-dark); line-height: 1.8; margin-left: 1.25rem;">
                        <li>Upload a PDF/DOCX or paste text.</li>
                        <li>Click "Analyze Resume".</li>
                        <li>Review your AI-generated summary, extracted skills, and identified skill gaps.</li>
                        <li>Get personalized job recommendations and a 3-month roadmap.</li>
                    </ol>
                </div>
            </div>
        </div>

    `;

    window.analyzeResume = async function () {
        const resumeText = document.getElementById('resumeText').value.trim();
        const fileInput = document.getElementById('resumeFile');
        const resumeFile = fileInput.files.length > 0 ? fileInput.files[0] : null;

        if (!resumeText && !resumeFile) {
            alert('Please paste your resume text or upload a file!');
            return;
        }

        const btn = document.getElementById('analyzeBtn');
        const originalText = btn.textContent;
        btn.textContent = "Analyzing...";
        btn.disabled = true;

        const resultsDiv = document.getElementById('analysisResults');
        resultsDiv.style.opacity = "0.5";

        const formData = new FormData();
        if (resumeText) formData.append('resume_text', resumeText);
        if (resumeFile) formData.append('resume_file', resumeFile);

        try {
            const response = await fetch('http://localhost:8000/api/analyze_resume', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            document.getElementById('resSummary').textContent = data.summary || "Summary not available.";

            const skillsDiv = document.getElementById('resSkills');
            skillsDiv.innerHTML = (data.skills || []).map(skill =>
                `<span class="tag success">${skill}</span>`
            ).join('');

            document.getElementById('resRoles').textContent = data.top_role || "Role not found.";

            const gapsUl = document.getElementById('resGaps');
            gapsUl.innerHTML = (data.skill_gaps || []).map(gap => `<li>${gap}</li>`).join('');

            const jobsUl = document.getElementById('resJobs');
            jobsUl.innerHTML = (data.top_jobs || []).map(job => `<li>${job}</li>`).join('');

            const roadmapUl = document.getElementById('resRoadmap');
            roadmapUl.innerHTML = (data.roadmap || []).map(step => `<li>${step}</li>`).join('');

            resultsDiv.style.display = 'block';
            resultsDiv.style.opacity = "1";
        } catch (error) {
            alert("Error analyzing resume: " + error.message);
            console.error(error);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    };
}
