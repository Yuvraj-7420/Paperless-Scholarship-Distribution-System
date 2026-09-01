import { useState, useEffect } from 'react';
import { User, Mail, CreditCard, Home, ShieldCheck, Save, Loader } from 'lucide-react';
import api from '../api';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    dob: '',
    aadhaar: '',
    address: '',
    accountNumber: '',
    ifsc: '',
    bankName: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setProfile(prev => ({ ...prev, ...response.data }));
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/users/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Update local storage user name if it changed
      const user = JSON.parse(localStorage.getItem('user'));
      user.name = profile.name;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="page-header">
        <h2>My Profile</h2>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} mb-2`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="profile-grid">
          <div className="profile-main">
            <div className="card">
              <div className="section-title">
                <User size={20} className="text-primary" />
                <h3>Personal Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={profile.email} readOnly className="readonly" />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    value={profile.dob || ''} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Aadhaar Number</label>
                  <input 
                    type="text" 
                    name="aadhaar" 
                    value={profile.aadhaar || ''} 
                    onChange={handleChange} 
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>
              </div>
              <div className="form-group mt-1">
                <label>Address</label>
                <textarea 
                  name="address" 
                  rows="3" 
                  value={profile.address || ''} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="card mt-2">
              <div className="section-title">
                <CreditCard size={20} className="text-primary" />
                <h3>Bank Details (for DBT)</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Account Number</label>
                  <input 
                    type="text" 
                    name="accountNumber" 
                    value={profile.accountNumber || ''} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label>IFSC Code</label>
                  <input 
                    type="text" 
                    name="ifsc" 
                    value={profile.ifsc || ''} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input 
                    type="text" 
                    name="bankName" 
                    value={profile.bankName || ''} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="card text-center">
              <div className="profile-avatar-large">
                <img src={`https://ui-avatars.com/api/?name=${profile.name}&background=2563EB&color=fff&size=128`} alt="Avatar" />
              </div>
              <h3 className="mt-1">{profile.name}</h3>
              <p className="text-secondary text-sm">{profile.email}</p>
              <div className="profile-badge mt-1">Student</div>
            </div>

            <div className="card mt-2">
              <div className="section-title">
                <ShieldCheck size={20} className="text-primary" />
                <h3>Account Security</h3>
              </div>
              <button type="button" className="btn-secondary w-full text-sm">Change Password</button>
              <button type="button" className="btn-outline w-full text-sm mt-1">Two-Factor Auth</button>
            </div>

            <button type="submit" className="btn-primary w-full mt-2 py-1" disabled={saving}>
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
