import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SkillGapAnalysisPage() {
  const [userSkills, setUserSkills] = useState([]);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedSkills = localStorage.getItem('userSkills');
    const parsedSkills = storedSkills ? JSON.parse(storedSkills) : [];
    setUserSkills(parsedSkills);

    if (parsedSkills.length > 0) {
      fetchAnalysis(parsedSkills);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchAnalysis = async (skills) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skills })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const recommendations = data.recommendations || [];

      // Process Data for Gap Analysis
      const matchedData = skills.map(skill => ({
        name: skill,
        level: 100,
        status: 'matched'
      }));

      const missingSkillCounts = {};
      recommendations.forEach(job => {
        if (job['Missing Skills']) {
          job['Missing Skills'].forEach(skill => {
            missingSkillCounts[skill] = (missingSkillCounts[skill] || 0) + 1;
          });
        }
      });

      const skillsToDevelopData = Object.entries(missingSkillCounts)
        .map(([name, count]) => ({
          name: name,
          frequency: count,
          status: 'develop',
          priority: count > (recommendations.length * 0.5) ? 'High Priority' : 'Medium Priority',
          description: `Required by ${Math.round((count / recommendations.length) * 100)}% of your recommended jobs`
        }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5);

      setAnalysisData({
        matched: matchedData,
        toDevelop: skillsToDevelopData,
        totalJobs: recommendations.length
      });
    } catch (err) {
      console.error('Gap Analysis Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (userSkills.length === 0 && !isLoading) {
    return (
      <>
        <div className="page-header">
          <h1>Skill Gap Analysis</h1>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No skills found</h3>
          <p>Please go back to the <a style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate('/skills-input')}>Skills Input</a> page to add your skills to see your gap analysis.</p>
          <button className="btn-primary" onClick={() => navigate('/skills-input')}>Add Skills</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Skill Gap Analysis</h1>
        <p>Identify missing skills and learn to develop them for better jobs</p>
      </div>

      {isLoading && (
        <div id="gap-analysis-loading" className="card glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{ border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p>Analyzing your skill profile against market demands...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!isLoading && error && (
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <h3 style={{ color: 'var(--danger)' }}>Analysis Failed</h3>
          <p>Could not connect to the recommendation engine to analyze skill gaps.</p>
          <code style={{ display: 'block', background: 'var(--bg-secondary)', color: 'var(--text-body)', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px' }}>
            {error}
          </code>
          <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={() => fetchAnalysis(userSkills)}>Try Again</button>
        </div>
      )}

      {!isLoading && analysisData && (
        <div id="gap-analysis-content">
          <div className="grid grid-3 mb-3">
            <div className="card" style={{ background: 'var(--success)', color: 'white' }}>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{analysisData.matched.length}</h3>
              <p>Skills You Have</p>
            </div>
            <div className="card" style={{ background: 'var(--warning)', color: 'white' }}>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{analysisData.toDevelop.length}</h3>
              <p>Skills to Develop</p>
            </div>
            <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
              <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{analysisData.toDevelop.length > 0 ? 'Active' : 'None'}</h3>
              <p>Learning Status</p>
            </div>
          </div>

          <div className="card mb-3">
            <h2 className="mb-2">Skill Match Analysis</h2>
            <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Green</span> = Your Skills, 
              <span style={{ color: 'var(--danger)', fontWeight: 600, marginLeft: '0.5rem' }}>Red</span> = Recommended to Learn
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {analysisData.matched.map(skill => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{skill.name}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>Matched</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)' }}></div>
                  </div>
                </div>
              ))}
              
              {analysisData.toDevelop.map(skill => {
                const percent = Math.max(10, (skill.frequency / Math.max(1, analysisData.totalJobs)) * 100);
                return (
                  <div key={skill.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{skill.name}</strong>
                      <span style={{ color: 'var(--danger)' }}>Missing</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-2">Skills to Develop for Better Jobs</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
              {analysisData.toDevelop.length > 0 ? analysisData.toDevelop.map(skill => (
                <div key={skill.name} style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{skill.name}</h3>
                        <span className={`tag ${skill.priority.includes('High') ? 'danger' : 'warning'}`} style={{ background: skill.priority.includes('High') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: skill.priority.includes('High') ? 'var(--danger)' : 'var(--warning)' }}>
                          {skill.priority}
                        </span>
                      </div>
                      <button className="btn-primary" onClick={() => alert(`Added ${skill.name} to learning plan!`)}>Add to Plan</button>
                    </div>
                    <p style={{ color: 'var(--text-body)', margin: 0 }}>{skill.description}</p>
                  </div>
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Recommended Actions:</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <a href={`https://www.google.com/search?q=learn+${encodeURIComponent(skill.name)}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                        Search for {skill.name} tutorials →
                      </a>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-body)' }}>
                  <p>Great job! You have a high match rate with recommended jobs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
