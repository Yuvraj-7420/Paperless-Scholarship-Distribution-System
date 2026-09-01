import { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Plus, Loader } from 'lucide-react';
import api from '../api';
import './Documents.css';

const Documents = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocs = async () => {
    try {
      const response = await api.get('/documents/my');
      setDocs(response.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocs();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocs(docs.filter(d => d.id !== id));
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  return (
    <div className="documents-container">
      <div className="page-header">
        <h2>Documents</h2>
        <div className="upload-btn-wrapper">
          <button className="btn-primary" disabled={uploading}>
            {uploading ? <Loader className="animate-spin" size={18} /> : <Plus size={18} />}
            {uploading ? 'Uploading...' : 'Upload New'}
          </button>
          <input type="file" onChange={handleFileUpload} disabled={uploading} />
        </div>
      </div>

      <div className="documents-grid">
        {loading ? (
          <p>Loading documents...</p>
        ) : docs.length > 0 ? docs.map((doc) => (
          <div key={doc.id} className="card doc-card">
            <div className="doc-icon">
              <FileText size={32} className="text-primary" />
            </div>
            <div className="doc-info">
              <h4>{doc.name}</h4>
              <p className="text-light text-sm">
                {new Date(doc.uploadDate).toLocaleDateString()} • {doc.size}
              </p>
            </div>
            <div className="doc-actions">
              <a 
                href={`http://localhost:5000/uploads/${doc.filename}`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-icon" 
                title="Download"
              >
                <Download size={18} />
              </a>
              <button 
                className="btn-icon text-error" 
                title="Delete"
                onClick={() => handleDelete(doc.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-docs card w-full">
            <p>No documents uploaded yet. Upload your ID proof, marksheets, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
