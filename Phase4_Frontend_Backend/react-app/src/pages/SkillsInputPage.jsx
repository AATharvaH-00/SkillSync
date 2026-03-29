import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function SkillsInputPage() {
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const savedSkills = localStorage.getItem('userSkills');
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(inputValue);
      setInputValue('');
    }
  };

  const getRecommendations = () => {
    if (skills.length === 0) {
      showToast('Please add at least one skill!', 'warning');
      return;
    }
    localStorage.setItem('userSkills', JSON.stringify(skills));
    navigate('/job-recommendations');
  };

  return (
    <>
      <div className="page-header">
        <h1>Skills-Based Job Recommendation</h1>
        <p>Enter your skills to find matching jobs</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="mb-2">Add Your Skills</h2>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a skill (e.g., Python, React)..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="mb-2">
            <p style={{ fontWeight: 600, color: 'var(--text-body)', marginBottom: '0.75rem' }}>Quick Add:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['Python', 'JavaScript', 'React', 'Node.js', 'SQL'].map(skill => (
                <button
                  key={skill}
                  className="tag primary"
                  onClick={() => addSkill(skill)}
                  style={{ cursor: 'pointer', border: 'none' }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div
            className="mb-2"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '50px',
              padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-color)'
            }}
          >
            {skills.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>No skills added yet</p>
            ) : (
              skills.map(skill => (
                <span key={skill} className="tag success">
                  {skill}
                  <span className="remove" onClick={() => removeSkill(skill)} style={{ cursor: 'pointer', marginLeft: '0.5rem' }}>×</span>
                </span>
              ))
            )}
          </div>

          <button className="btn-primary w-full" onClick={getRecommendations}>
            Get Job Recommendations
          </button>
        </div>
      </div>
    </>
  );
}
