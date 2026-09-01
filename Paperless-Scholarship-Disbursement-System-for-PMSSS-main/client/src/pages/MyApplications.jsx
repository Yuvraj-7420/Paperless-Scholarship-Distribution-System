import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import api from '../api';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my');
        setApplications(response.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
      case 'PAID':
        return <span className="badge badge-success">{status}</span>;
      case 'PENDING':
      case 'UNDER_REVIEW':
        return <span className="badge badge-warning">{status}</span>;
      case 'REJECTED': 
        return <span className="badge badge-error">{status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="applications-container">
      <div className="page-header">
        <h2>My Applications</h2>
        <div className="filters">
          <select className="form-select status-filter">
            <option>All Statuses</option>
            <option>PENDING</option>
            <option>APPROVED</option>
            <option>REJECTED</option>
          </select>
        </div>
      </div>

      <div className="card table-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>You have not applied for any scholarships yet.</div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Scholarship Name</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="font-medium text-primary">APP-{app.id}</td>
                  <td className="font-medium">{app.scholarshipName}</td>
                  <td className="text-secondary">{new Date(app.appliedDate).toLocaleDateString()}</td>
                  <td>{getStatusBadge(app.status)}</td>
                  <td>
                    <button 
                      className="btn-icon" 
                      title="View Details"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button className="btn-close" onClick={() => setSelectedApp(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Scholarship Info</h4>
                <div className="detail-grid">
                  <div className="detail-item"><span>Name:</span> {selectedApp.scholarshipName}</div>
                  <div className="detail-item"><span>Status:</span> {getStatusBadge(selectedApp.status)}</div>
                  <div className="detail-item"><span>Applied On:</span> {new Date(selectedApp.appliedDate).toLocaleString()}</div>
                </div>
              </div>

              <div className="detail-section mt-2">
                <h4>Personal Details</h4>
                <div className="detail-grid">
                  <div className="detail-item"><span>Full Name:</span> {selectedApp.name || 'N/A'}</div>
                  <div className="detail-item"><span>Email:</span> {selectedApp.email || 'N/A'}</div>
                  <div className="detail-item"><span>Aadhaar:</span> {selectedApp.aadhaar || 'N/A'}</div>
                  <div className="detail-item"><span>DOB:</span> {selectedApp.dob || 'N/A'}</div>
                </div>
                <div className="detail-item mt-1"><span>Address:</span> {selectedApp.address || 'N/A'}</div>
              </div>

              <div className="detail-section mt-2">
                <h4>Academic Details</h4>
                <div className="detail-grid">
                  <div className="detail-item"><span>College:</span> {selectedApp.collegeName || 'N/A'}</div>
                  <div className="detail-item"><span>Course:</span> {selectedApp.course || 'N/A'}</div>
                  <div className="detail-item"><span>Year:</span> {selectedApp.year || 'N/A'}</div>
                  <div className="detail-item"><span>Last Marks:</span> {selectedApp.marks ? `${selectedApp.marks}%` : 'N/A'}</div>
                </div>
              </div>

              {selectedApp.remarks && (
                <div className="detail-section mt-2">
                  <h4>Remarks</h4>
                  <p className="text-secondary">{selectedApp.remarks}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
