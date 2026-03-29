import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Components
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SkillsInputPage from './pages/SkillsInputPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import JobRecommendationsPage from './pages/JobRecommendationsPage';
import SkillGapAnalysisPage from './pages/SkillGapAnalysisPage';
import SettingsPage from './pages/SettingsPage';

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/home';
  const showSidebar = !isHome && !['/login', '/signup', '/auth'].includes(location.pathname);

  // Read theme from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
      document.body.classList.remove('dark-theme');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-theme');
    }
  }, []);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <TopNavbar />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Content Area */}
        <main
          className="content-area"
          id="content"
          style={isHome ? { padding: 0, background: 'transparent' } : {}}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/skills-input" element={<ProtectedRoute><SkillsInputPage /></ProtectedRoute>} />
            <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>} />
            <Route path="/job-recommendations" element={<ProtectedRoute><JobRecommendationsPage /></ProtectedRoute>} />
            <Route path="/skill-gap-analysis" element={<ProtectedRoute><SkillGapAnalysisPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppLayout />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
