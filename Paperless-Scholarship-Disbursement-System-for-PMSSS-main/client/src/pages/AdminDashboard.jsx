import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, XCircle, Clock, Eye, Search } from 'lucide-react';
import api from '../api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        api.get('/admin/applications'),
        api.get('/admin/stats')
      ]);
      setApps(appsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const remarks = window.prompt(`Enter remarks for ${status}:`);
    if (remarks === null) return;

    setActionLoading(true);
    try {
      await api.put(`/admin/applications/${id}/status`, { status, remarks });
      fetchData();
      setSelectedApp(null);
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = apps.filter(a => filter === 'ALL' || a.status === filter);

  if (loading) return <div className="p-4">Loading Admin Panel...</div>;

  return (
    <div className="admin-container">
      <div className="page-header">
        <div>
          <h2>Admin Management Console</h2>
          <p className="text-secondary">Manage and process scholarship applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Users size={24} /></div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Total Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange"><Clock size={24} /></div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending Review</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green"><CheckCircle size={24} /></div>
          <div className="stat-info">
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-red"><XCircle size={24} /></div>
          <div className="stat-info">
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="card mt-2 table-card">
        <div className="table-header">
          <h3>Recent Applications</h3>
          <div className="table-actions">
            <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="APPROVED">Approved Only</option>
              <option value="REJECTED">Rejected Only</option>
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Scholarship</th>
              <th>Date</th>
              <th>Marks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(app => (
              <tr key={app.id}>
                <td>
                  <div className="student-cell">
                    <p className="font-medium">{app.name}</p>
                    <p className="text-xs text-secondary">{app.email}</p>
                  </div>
                </td>
                <td>{app.scholarshipName}</td>
                <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                <td>{app.marks}%</td>
                <td>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" onClick={() => setSelectedApp(app)} title="View & Action">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content card admin-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Review Application: {selectedApp.name}</h3>
              <button className="btn-close" onClick={() => setSelectedApp(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Student Information</h4>
                  <p><span>Email:</span> {selectedApp.email}</p>
                  <p><span>DOB:</span> {selectedApp.dob}</p>
                  <p><span>Aadhaar:</span> {selectedApp.aadhaar}</p>
                  <p><span>Address:</span> {selectedApp.address}</p>
                </div>
                <div className="detail-section">
                  <h4>Academic Information</h4>
                  <p><span>College:</span> {selectedApp.collegeName}</p>
                  <p><span>Course:</span> {selectedApp.course}</p>
                  <p><span>Year:</span> {selectedApp.year}</p>
                  <p><span>Marks:</span> {selectedApp.marks}%</p>
                </div>
              </div>

              <div className="document-review mt-1">
                <h4>Documents Provided</h4>
                <div className="doc-links">
                  {selectedApp.incomeCertId && <button className="btn-outline btn-sm">Income Certificate</button>}
                  {selectedApp.marksheetId && <button className="btn-outline btn-sm">Marksheet</button>}
                  {selectedApp.aadhaarDocId && <button className="btn-outline btn-sm">Aadhaar Proof</button>}
                </div>
              </div>
            </div>
            <div className="modal-footer admin-actions">
              <button 
                className="btn-error" 
                onClick={() => handleStatusUpdate(selectedApp.id, 'REJECTED')}
                disabled={actionLoading}
              >
                Reject Application
              </button>
              <button 
                className="btn-primary" 
                onClick={() => handleStatusUpdate(selectedApp.id, 'APPROVED')}
                disabled={actionLoading}
              >
                Approve & Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
