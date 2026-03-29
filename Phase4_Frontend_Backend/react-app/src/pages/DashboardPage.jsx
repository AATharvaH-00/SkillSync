import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-header">
        <h1>AI Job Recommendation Dashboard</h1>
        <p>Access over 50,000+ jobs curated for your skills</p>
      </div>

      <div className="grid grid-2 mb-3">
        <div className="card glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/skills-input')}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <h2 style={{ color: 'var(--text-heading)', marginBottom: '0.5rem' }}>Enter Your Skills</h2>
            <p style={{ color: 'var(--text-body)' }}>Manually input your skills to get personalized job recommendations based on your expertise.</p>
            <button className="btn-primary mt-2">Input Skills</button>
          </div>
        </div>

        <div className="card glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/resume-analyzer')}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h2 style={{ color: 'var(--text-heading)', marginBottom: '0.5rem' }}>Analyze Your Resume</h2>
            <p style={{ color: 'var(--text-body)' }}>Paste your resume text and let AI extract skills automatically for job matching.</p>
            <button className="btn-primary mt-2">Analyze Resume</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>How SkillSync Works</h2>
        <div className="grid grid-2">
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>1</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Input Skills</h3>
            <p style={{ color: 'var(--text-muted)' }}>Enter skills or upload resume</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>2</div>
            <h3 style={{ marginBottom: '0.5rem' }}>AI Processing</h3>
            <p style={{ color: 'var(--text-muted)' }}>Skills extraction and matching</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>3</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Job Matching</h3>
            <p style={{ color: 'var(--text-muted)' }}>Find best matching jobs</p>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>4</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Skill Gap Analysis</h3>
            <p style={{ color: 'var(--text-muted)' }}>Identify areas to improve</p>
          </div>
        </div>
      </div>
    </>
  );
}
