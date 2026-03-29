import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JobCard({ job }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse "95%" -> 95
  const scoreVal = parseInt(job['Match Score']);
  let scoreColor = 'var(--danger)';
  if (scoreVal >= 80) scoreColor = 'var(--success)';
  else if (scoreVal >= 50) scoreColor = 'var(--warning)';

  return (
    <div className="job-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3>{job['Job Title']}</h3>
          <p className="company" style={{ fontWeight: 600, color: 'var(--primary)' }}>{job['Company']}</p>
        </div>
        <div className="match-score" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: scoreColor }}>{job['Match Score']}</span>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Match</span>
        </div>
      </div>
      
      <div style={{ margin: '1rem 0' }}>
        <div className="progress-bar" style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${scoreVal}%`, height: '100%', background: scoreColor, transition: 'width 0.5s ease' }}></div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Required Skills:
        </strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {(job['Required Skills'] || []).map((skill, index) => (
            <span key={index} className="tag primary">{skill}</span>
          ))}
        </div>
      </div>

      {job['Missing Skills'] && job['Missing Skills'].length > 0 && (
        <div style={{ marginBottom: '1rem', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.3)' }}>
          <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: 'var(--danger)' }}>
            Missing Skills (Gap Analysis):
          </strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {job['Missing Skills'].map((skill, index) => (
              <span key={index} className="tag" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <a href={job.redirect_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Apply Now
        </a>
        <button className="btn-outline" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide details' : 'View details'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-foreground)' }}>Job Summary:</strong>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            {job.Description ? job.Description : "No additional description provided for this role."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function JobRecommendationsPage() {
  const [skills, setSkills] = useState([]);
  const [locationStr, setLocationStr] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedSkills = localStorage.getItem('userSkills');
    const parsedSkills = storedSkills ? JSON.parse(storedSkills) : [];
    setSkills(parsedSkills);
    
    if (parsedSkills.length > 0) {
      fetchJobs(parsedSkills, locationStr);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const fetchJobs = async (skillsArray, location) => {
    setIsLoading(true);
    setError(null);
    setJobs([]);

    try {
      const response = await fetch('http://localhost:8000/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skills: skillsArray, location: location })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setJobs(data.recommendations || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    setLocationStr(newLocation);
    if (skills.length > 0) {
      fetchJobs(skills, newLocation);
    }
  };

  if (skills.length === 0 && !isLoading) {
    return (
      <>
        <div className="page-header">
          <h1>Job Recommendations</h1>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No skills found</h3>
          <p>Please go back to the <a style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate('/skills-input')}>Skills Input</a> page to add your skills.</p>
          <button className="btn-primary" onClick={() => navigate('/skills-input')}>Add Skills</button>
        </div>
      </>
    );
  }

  // Helper to visually map select value to country string
  const locationLabels = {
    '': 'All Countries (Global)',
    'in': 'India',
    'us': 'United States',
    'gb': 'United Kingdom',
    'ca': 'Canada',
    'au': 'Australia',
    'de': 'Germany',
    'fr': 'France',
    'nl': 'Netherlands',
    'nz': 'New Zealand',
    'sg': 'Singapore',
    'za': 'South Africa'
  };
  const locationText = locationLabels[locationStr] || locationStr;

  return (
    <>
      <div className="page-header">
        <h1>Job Recommendations</h1>
        <p>Browse jobs matched to your skills: <strong>{skills.join(', ')}</strong></p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar Filters */}
        <div style={{ width: '280px', flexShrink: 0 }}>
          <div className="card">
            <h3 className="mb-2">Filters</h3>
            <div className="form-group">
              <label>Location</label>
              <select className="form-control" value={locationStr} onChange={handleLocationChange}>
                <option value="">All Countries (Global)</option>
                <option value="in">India</option>
                <option value="us">United States</option>
                <option value="gb">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="nl">Netherlands</option>
                <option value="nz">New Zealand</option>
                <option value="sg">Singapore</option>
                <option value="za">South Africa</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal' }}>
                <input type="checkbox" id="remoteOnly" />
                Remote Only
              </label>
            </div>
          </div>
        </div>

        {/* Job List Area */}
        <div style={{ flex: 1 }}>
          {isLoading && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div 
                className="spinner" 
                style={{ 
                  border: '4px solid var(--border-color)', 
                  borderTop: '4px solid var(--primary)', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  margin: '0 auto 1rem',
                  animation: 'spin 1s linear infinite' 
                }}
              ></div>
              <p>Finding the perfect jobs for you in {locationText}...</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {!isLoading && error && (
            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <h3 style={{ color: 'var(--danger)' }}>Connection Error</h3>
              <p>Could not connect to the recommendation engine. Is the backend server running?</p>
              <code style={{ display: 'block', background: 'var(--bg-secondary)', color: 'var(--text-body)', padding: '0.5rem', marginTop: '0.5rem', borderRadius: '4px' }}>
                {error}
              </code>
              <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={() => fetchJobs(skills, locationStr)}>Try Again</button>
            </div>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <div className="card">
              <h3>No matches found in {locationText}</h3>
              <p>Try adding more diverse skills to your profile or choose a different location.</p>
            </div>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <>
              <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--border-radius)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Top Matches in {locationText}</h3>
                  <p style={{ color: 'var(--text-body)', margin: 0 }}>{jobs.length} jobs found for your profile</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {jobs.map((job, idx) => (
                  <JobCard key={idx} job={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
