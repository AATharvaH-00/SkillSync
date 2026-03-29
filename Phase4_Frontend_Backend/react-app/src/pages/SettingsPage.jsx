import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));
  const { showToast } = useToast();

  useEffect(() => {
    // Keep internal component state synced with body class
    setIsDark(document.body.classList.contains('dark-theme'));
  }, []);

  const handleThemeToggle = (e) => {
    const checked = e.target.checked;
    setIsDark(checked);
    
    if (checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
      showToast('Dark mode enabled 🌙', 'info');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
      showToast('Light mode enabled ☀️', 'info');
    }
  };

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="mb-2">Profile Information</h2>
          <form onSubmit={e => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="profileName">Full Name</label>
              <input type="text" id="profileName" className="form-control" defaultValue="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="profileEmail">Email Address</label>
              <input type="email" id="profileEmail" className="form-control" defaultValue="john@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="profileTitle">Job Title</label>
              <input type="text" id="profileTitle" className="form-control" placeholder="e.g., Software Engineer" />
            </div>
            <button type="submit" className="btn-primary" onClick={() => showToast('Profile saved!', 'success')}>Save Changes</button>
          </form>
        </div>

        <div className="card">
          <h2 className="mb-2">Notification Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <span>Email notifications for new job matches</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <span>Weekly skill gap analysis reports</span>
              <input type="checkbox" defaultChecked />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <span>Learning resource recommendations</span>
              <input type="checkbox" />
            </label>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-2">Appearance & Theme</h2>
          <p className="mb-2" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Customize how SkillSync looks on your device.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'var(--transition)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </div>
                <div>
                  <span style={{ display: 'block', fontWeight: 600 }}>Dark Mode</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Switch to a dark UI with soft blue accents</span>
                </div>
              </div>
              <div className="theme-switch-wrapper">
                <input type="checkbox" id="theme-toggle" checked={isDark} onChange={handleThemeToggle} />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="card mt-3" style={{ border: '1px solid var(--danger)' }}>
        <h2 className="mb-2" style={{ color: 'var(--danger)' }}>Danger Zone</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
        <button className="btn-danger" onClick={() => { if(window.confirm('Are you sure?')) alert('Account deleted') }}>Delete Account</button>
      </div>
    </>
  );
}
