import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Theme toggle logic specific for landing page footer
    const btn = document.getElementById('lpThemeBtn');
    const icon = document.getElementById('lpThemeIcon');
    const label = document.getElementById('lpThemeLabel');

    if (!btn || !icon || !label) return;

    function applyTheme(isDark) {
      if (isDark) {
        document.body.classList.add('dark-theme');
        icon.textContent = '☀️';
        label.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        icon.textContent = '🌙';
        label.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
      }
    }

    applyTheme(document.body.classList.contains('dark-theme'));

    const handleToggle = () => {
      const nowDark = !document.body.classList.contains('dark-theme');
      applyTheme(nowDark);
    };

    btn.addEventListener('click', handleToggle);
    return () => btn.removeEventListener('click', handleToggle);
  }, []);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="lp-hero">
        <div className="lp-hero-bg"></div>
        <div className="lp-container">
          <div className="lp-hero-content">
            <div className="lp-badge">
              <span className="lp-badge-dot"></span>
              AI-Powered Career Intelligence
            </div>
            <h1 className="lp-hero-title">
              Find Your Perfect Job<br />
              <span className="lp-gradient-text">in 60 Seconds</span>
            </h1>
            <p className="lp-hero-subtitle">
              Upload your resume &rarr; Get personalized job matches &rarr; skill gap insights &rarr; and a
              3-month learning roadmap.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-btn-primary" onClick={() => navigate('/signup')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                Get Started — It's Free
              </button>
              <button className="lp-btn-ghost" onClick={() => document.getElementById('lp-how').scrollIntoView({ behavior: 'smooth' })}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                See How It Works
              </button>
            </div>
            <div className="lp-hero-stats">
              <div className="lp-stat">
                <span className="lp-stat-num">92%</span>
                <span className="lp-stat-label">Skill Accuracy</span>
              </div>
              <div className="lp-stat-divider"></div>
              <div className="lp-stat">
                <span className="lp-stat-num">10k+</span>
                <span className="lp-stat-label">Job Matches</span>
              </div>
              <div className="lp-stat-divider"></div>
              <div className="lp-stat">
                <span className="lp-stat-num">3 min</span>
                <span className="lp-stat-label">Avg. Setup</span>
              </div>
            </div>
          </div>
          <div className="lp-hero-visual">
            <div className="lp-mockup-card lp-card-float">
              <div className="lp-mockup-header">
                <div className="lp-dot red"></div>
                <div className="lp-dot yellow"></div>
                <div className="lp-dot green"></div>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>SkillSync AI</span>
              </div>
              <div className="lp-mockup-body">
                <div className="lp-match-row">
                  <div className="lp-match-icon blue">💼</div>
                  <div className="lp-match-info">
                    <div className="lp-match-title">Senior React Developer</div>
                    <div className="lp-match-meta">Google · Bangalore · ₹25L–35L</div>
                  </div>
                  <div className="lp-match-score">96%</div>
                </div>
                <div className="lp-match-row">
                  <div className="lp-match-icon purple">🚀</div>
                  <div className="lp-match-info">
                    <div className="lp-match-title">Full Stack Engineer</div>
                    <div className="lp-match-meta">Flipkart · Remote · ₹20L–28L</div>
                  </div>
                  <div className="lp-match-score">89%</div>
                </div>
                <div className="lp-match-row">
                  <div className="lp-match-icon green">📊</div>
                  <div className="lp-match-info">
                    <div className="lp-match-title">ML Engineer</div>
                    <div className="lp-match-meta">Zomato · Hybrid · ₹18L–26L</div>
                  </div>
                  <div className="lp-match-score">82%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS (3-STEP FLOW) ===== */}
      <section className="lp-flow-section" id="lp-how">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-section-label">How It Works</p>
            <h2 className="lp-section-title">Three Steps to Your Dream Job</h2>
            <p className="lp-section-sub">No manual searching. No guesswork. Just results.</p>
          </div>
          <div className="lp-flow">
            <div className="lp-flow-step">
              <div className="lp-step-icon" style={{ '--step-color': '#3B82F6' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="lp-step-num">01</div>
              <h3 className="lp-step-title">Upload Resume</h3>
              <p className="lp-step-desc">Drop your PDF or paste plain text. Our AI instantly reads your experience, education, and skills.</p>
            </div>
            <div className="lp-flow-arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </div>
            <div className="lp-flow-step">
              <div className="lp-step-icon" style={{ '--step-color': '#8B5CF6' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <div className="lp-step-num">02</div>
              <h3 className="lp-step-title">AI Analyzes</h3>
              <p className="lp-step-desc">Our LLM extracts 50+ skills, identifies gaps, and maps your profile against thousands of live jobs.</p>
            </div>
            <div className="lp-flow-arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </div>
            <div className="lp-flow-step">
              <div className="lp-step-icon" style={{ '--step-color': '#10B981' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="lp-step-num">03</div>
              <h3 className="lp-step-title">Get Results</h3>
              <p className="lp-step-desc">Receive ranked job matches, a skill gap dashboard, and a personalised 3-month learning roadmap.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="lp-features-section">
        <div className="lp-container">
          <div className="lp-section-header">
            <p className="lp-section-label">Why SkillSync?</p>
            <h2 className="lp-section-title">Everything You Need to Land the Job</h2>
          </div>
          <div className="lp-features-grid">
            <div className="lp-feature-card lp-feature-blue">
              <div className="lp-feature-icon">🎯</div>
              <h3>92% Accurate Skill Extraction</h3>
              <p>Our NLP model parses PDFs and text resumes with industry-leading precision, pulling hard and soft skills alike.</p>
              <div className="lp-feature-tag">ML-Powered</div>
            </div>
            <div className="lp-feature-card lp-feature-purple">
              <div className="lp-feature-icon">📍</div>
              <h3>Location-Focused Job Matches</h3>
              <p>Set your preferred city or remote preference. We filter thousands of listings to show only what's reachable for you.</p>
              <div className="lp-feature-tag">Hyper-Local</div>
            </div>
            <div className="lp-feature-card lp-feature-green">
              <div className="lp-feature-icon">🗺️</div>
              <h3>3-Month Learning Roadmap</h3>
              <p>AI generates a week-by-week plan with curated courses to close your skill gaps and meet job requirements faster.</p>
              <div className="lp-feature-tag">AI Roadmap</div>
            </div>
            <div className="lp-feature-card lp-feature-orange">
              <div className="lp-feature-icon">📊</div>
              <h3>Real-Time Skill Gap Analysis</h3>
              <p>Visualise exactly which skills are missing for your target roles and track your progress as you learn.</p>
              <div className="lp-feature-tag">Dashboard</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="lp-cta-section">
        <div className="lp-container">
          <div className="lp-cta-box">
            <div className="lp-cta-glow"></div>
            <h2 className="lp-cta-title">Ready to Land Your Dream Job?</h2>
            <p className="lp-cta-sub">Join thousands of professionals who accelerated their career with SkillSync AI.</p>
            <button className="lp-btn-primary lp-btn-large" onClick={() => navigate('/signup')}>
              Get Started Now — Free Forever
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
            <p className="lp-cta-note">No credit card required &nbsp;·&nbsp; Setup in under 3 minutes</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-brand">
            <span className="lp-footer-logo">SkillSync<span style={{ color: 'var(--primary)' }}> AI</span></span>
            <span className="lp-footer-tagline">Built for ambitious professionals</span>
          </div>
          <div className="lp-footer-links">
            <a onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</a>
            <a onClick={() => navigate('/resume-analyzer')} style={{ cursor: 'pointer' }}>Resume Analyzer</a>
            <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a>
            <a onClick={() => navigate('/signup')} style={{ cursor: 'pointer' }}>Sign Up</a>
          </div>

          {/* ===== THEME TOGGLE ===== */}
          <div className="lp-theme-toggle-wrap">
            <button className="lp-theme-toggle" id="lpThemeBtn" title="Toggle light / dark mode">
              <span className="lp-theme-icon" id="lpThemeIcon">🌙</span>
              <span className="lp-theme-label" id="lpThemeLabel">Dark Mode</span>
            </button>
          </div>

          <p className="lp-footer-copy">&copy; 2025 SkillSync AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
