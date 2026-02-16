# SkillSync Frontend

A modern, responsive frontend for the SkillSync AI-powered job recommendation platform.

## 🎯 Features

- **User Authentication**: Login and Signup pages with form validation
- **Dashboard**: Overview of job statistics and quick access to main features
- **Skills Input**: Interactive interface to manually add and manage skills
- **Resume Analyzer**: AI-powered resume analysis to extract skills automatically
- **Job Recommendations**: Browse and filter jobs matched to your profile with match scores
- **Skill Gap Analysis**: Identify missing skills and access learning resources
- **Settings**: Manage profile and notification preferences

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Python 3.x (for running a local development server)

### Installation & Running

1. Navigate to the project directory:
```bash
cd "d:\Atharva engineering\PROJECTS\SkillSync all data\SkillSync\Phase4_LLM_Frontend"
```

2. Start a local development server:
```bash
python -m http.server 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 📁 Project Structure

```
Phase4_LLM_Frontend/
├── index.html              # Main HTML file
├── styles.css              # Comprehensive CSS design system
├── app.js                  # Client-side routing and app initialization
├── pages/
│   ├── login.js           # Login page
│   ├── signup.js          # Signup page
│   ├── dashboard.js       # Main dashboard
│   ├── skills-input.js    # Skills input interface
│   ├── resume-analyzer.js # Resume analysis page
│   ├── job-recommendations.js # Job listings
│   ├── skill-gap-analysis.js  # Skill gap analysis
│   └── settings.js        # User settings
└── README.md              # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations and transitions
- **Color System**: Consistent theming with CSS variables
- **Typography**: Inter font family for excellent readability

## 🔧 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript**: No framework dependencies for lightweight performance
- **Client-Side Routing**: Hash-based navigation for SPA experience

## 📱 Navigation Flow

1. **Dashboard** → Click "Input Skills" → **Skills Input Page**
2. **Dashboard** → Click "Analyze Resume" → **Resume Analyzer Page**
3. **Top Nav** → Click "Login" or "Sign Up" → **Authentication Pages**
4. **Sidebar** → Navigate to any page in the app

## 🎯 Key User Flows

### Adding Skills
1. Navigate to Skills Input page
2. Type skill name or use quick-add buttons
3. Press Enter or click "+" to add
4. Click "Get Job Recommendations" to see matching jobs

### Analyzing Resume
1. Navigate to Resume Analyzer page
2. Paste your resume text in the textarea
3. Click "Analyze Resume"
4. View extracted skills
5. Navigate to Job Recommendations

### Viewing Job Matches
1. Navigate to Job Recommendations
2. Use filters to refine results
3. View match scores and required skills
4. Click "Apply" to apply for jobs

## 🌟 Demo Mode

This is a frontend demonstration. All functionality is client-side:
- Login/Signup forms validate input but don't connect to a backend
- Resume analysis uses pattern matching to extract common skills
- Job recommendations display sample data
- All actions show alerts/notifications for user feedback

## 🔜 Future Enhancements

- Backend API integration
- Real-time job data from job boards
- User authentication with JWT
- Skill recommendation engine
- Advanced resume parsing with AI
- Learning path recommendations
- Job application tracking

## 📄 License

Part of the SkillSync project - An AI-powered job recommendation system.

---

**Built with ❤️ for better job matching**
