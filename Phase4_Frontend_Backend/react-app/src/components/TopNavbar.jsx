import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function TopNavbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('You have been signed out. See you soon! 👋', 'info');
    navigate('/login');
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h1>SkillSync</h1>
        <p className="tagline">Find your perfect job</p>
      </div>
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <div className="navbar-user">
              <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
            </div>
            <button className="btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate('/signup')}
              style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)', border: 'none' }}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
