import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, Bell, HelpCircle, GraduationCap, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Student' };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const studentMenuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Apply Scholarship', icon: <GraduationCap size={20} />, path: '/apply' },
    { name: 'My Applications', icon: <FileText size={20} />, path: '/applications' },
    { name: 'Documents', icon: <FolderOpen size={20} />, path: '/documents' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    { name: 'Help / Support', icon: <HelpCircle size={20} />, path: '/support' },
  ];

  const adminMenuItems = [
    { name: 'Admin Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'All Applications', icon: <FileText size={20} />, path: '/admin/dashboard' },
  ];

  const menuItems = user.role === 'admin' ? adminMenuItems : studentMenuItems;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"></div>
        <h2>GovScholar</h2>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="profile-mini">
          <div className="avatar">
            {user.role === 'admin' ? 'AD' : user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="profile-info">
            <p className="name">{user.name}</p>
            <p className="role">{user.role === 'admin' ? 'Administrator' : 'Student'}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
