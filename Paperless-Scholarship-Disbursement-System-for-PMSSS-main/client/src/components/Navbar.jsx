import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, ChevronDown, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder={user.role === 'admin' ? "Search students, applications..." : "Search scholarships, applications..."} 
        />
      </div>
      
      <div className="navbar-actions">
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        {user.role !== 'admin' && (
          <button className="icon-btn">
            <Settings size={20} />
          </button>
        )}
        
        <Link to={user.role === 'admin' ? "/admin/dashboard" : "/profile"} className="profile-dropdown">
          <div className="avatar-small">
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff`} alt="Profile" />
          </div>
          <span className="user-name">{user.name}</span>
          <ChevronDown size={16} className="text-secondary" />
        </Link>
        
        <button className="icon-btn text-error" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
