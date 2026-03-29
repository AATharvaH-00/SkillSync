import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    } else {
      setResumeFile(null);
    }
  };

  const analyzeResume = async () => {
    if (!resumeText.trim() && !resumeFile) {
      showToast('Please paste your resume text or upload a file!', 'warning');
      return;
    }

    setIsAnalyzing(true);
    setResults(null); // Clear previous results

    const formData = new FormData();
    if (resumeText.trim()) formData.append('resume_text', resumeText.trim());
    if (resumeFile) formData.append('resume_file', resumeFile);

    try {
      const response = await fetch('http://localhost:8000/api/analyze_resume', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      
      // Auto-save the extracted skills for the job recommendations page
      if (data.skills && Array.isArray(data.skills)) {
         localStorage.setItem('userSkills', JSON.stringify(data.skills));
      }

    } catch (error) {
      showToast("Error analyzing resume: " + error.message, 'error');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Resume Analyzer</h1>
        <p>Paste your resume to extract skills and get job recommendations</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="mb-2">Resume Analyzer</h2>
          <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>
            Upload your resume PDF or paste your resume content below to extract skills
          </p>
          
          <div className="form-group">
            <label htmlFor="resumeFile">Upload Resume (PDF/DOCX)</label>
            <input 
              type="file" 
              id="resumeFile" 
              className="form-control" 
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="form-group mt-2">
            <label htmlFor="resumeText">Or Paste Resume Text</label>
            <textarea 
              id="resumeText" 
              className="form-control" 
              placeholder="Paste your resume content here..." 
              style={{ minHeight: '200px' }}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>

          <button 
            className="btn-primary w-full mt-2" 
            onClick={analyzeResume}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>

          {results && (
            <div className="mt-3 card glass-card" style={{ textAlign: 'left' }}>
              <details open style={{ marginBottom: '1rem' }}>
                <summary style={{ fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--primary)' }}>
                  RESULTS DISPLAY
                </summary>
                
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>RESUME SUMMARY</h4>
                  <p style={{ fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {results.summary || "Summary not available."}
                  </p>
                  
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>YOUR SKILLS</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {(results.skills || []).map((skill, index) => (
                      <span key={index} className="tag success">{skill}</span>
                    ))}
                  </div>
                  
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>TOP ROLES</h4>
                  <p style={{ fontWeight: 'bold', color: 'var(--secondary)', marginBottom: '1rem' }}>
                    {results.top_role || "Role not found."}
                  </p>
                  
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>SKILL GAPS</h4>
                  <ul style={{ listStyleType: 'none', marginBottom: '1rem', color: 'var(--danger)' }}>
                    {(results.skill_gaps || []).map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))}
                  </ul>
                  
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>TOP JOBS</h4>
                  <ul style={{ listStyleType: 'disc', marginLeft: '1.25rem', marginBottom: '1rem' }}>
                    {(results.top_jobs || []).map((job, index) => (
                      <li key={index}>{job}</li>
                    ))}
                  </ul>
                  
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>3-MONTH ROADMAP</h4>
                  <ul style={{ listStyleType: 'decimal', marginLeft: '1.25rem', marginBottom: '1rem', color: 'var(--success)' }}>
                    {(results.roadmap || []).map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </details>
              
              <button className="btn-success w-full mt-2" onClick={() => navigate('/job-recommendations')}>
                View Job Recommendations
              </button>
            </div>
          )}
        </div>

        <div className="card glass-card" style={{ height: 'fit-content' }}>
          <h3 className="mb-2">Analyze Your Resume</h3>
          <p style={{ color: 'var(--text-body)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Upload your resume or paste the text. Our AI will analyze your profile and match you with the best opportunities.
          </p>
          
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--border-radius)', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Instructions</h4>
            <ol style={{ color: 'var(--text-body)', lineHeight: 1.8, marginLeft: '1.25rem' }}>
              <li>Upload a PDF/DOCX or paste text.</li>
              <li>Click "Analyze Resume".</li>
              <li>Review your AI-generated summary, extracted skills, and identified skill gaps.</li>
              <li>Get personalized job recommendations and a 3-month roadmap.</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
