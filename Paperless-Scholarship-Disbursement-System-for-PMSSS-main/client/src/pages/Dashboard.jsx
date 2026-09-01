import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, FileText, ChevronRight } from 'lucide-react';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [scholarships, setScholarships] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch scholarships from backend
    const fetchScholarships = async () => {
      try {
        const response = await api.get('/scholarships');
        setScholarships(response.data);
      } catch (err) {
        console.error("Failed to fetch scholarships", err);
      }
    };
    
    fetchScholarships();
  }, [navigate]);

  const stats = [
    { label: 'Available', value: scholarships.length, icon: <BookOpen className="text-primary" />, bg: 'bg-blue-50' },
    { label: 'Applied', value: '0', icon: <FileText className="text-warning" />, bg: 'bg-yellow-50' },
    { label: 'Approved', value: '0', icon: <CheckCircle className="text-success" />, bg: 'bg-green-50' },
    { label: 'Pending', value: '0', icon: <Clock className="text-purple" />, bg: 'bg-purple-50' }
  ];

  return (
    <div className="dashboard">
      <div className="welcome-banner card">
        <div className="welcome-text">
          <h1>Welcome back, {user ? user.name : 'Student'} 👋</h1>
          <p>Here is what's happening with your applications today.</p>
        </div>
        <div className="profile-progress">
          <div className="progress-header">
            <span>Profile Completion</span>
            <span className="font-bold text-primary">0%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '0%' }}></div>
          </div>
          <Link to="/profile" className="complete-btn">Complete Profile</Link>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card card">
            <div className={`stat-icon ${stat.bg}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="scholarships-section card">
          <div className="section-header">
            <h2>Recommended Scholarships</h2>
            <Link to="/apply" className="view-all">View All</Link>
          </div>
          
          <div className="scholarships-list">
            {scholarships.length > 0 ? scholarships.map(scholarship => (
              <div key={scholarship.id} className="scholarship-item">
                <div className="scholarship-details">
                  <h4>{scholarship.name}</h4>
                  <div className="scholarship-meta">
                    <span className="amount">₹{scholarship.amount}/yr</span>
                    <span className="dot">•</span>
                    <span className="eligibility">{scholarship.eligibility}</span>
                  </div>
                  <p className="deadline text-error">Category: {scholarship.category}</p>
                </div>
                <Link to={`/apply?id=${scholarship.id}`} className="btn-primary">Apply Now</Link>
              </div>
            )) : <p>No scholarships available at the moment.</p>}
          </div>
        </div>

        <div className="activity-section card">
          <div className="section-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="activity-timeline">
            <p>No recent activity found.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
