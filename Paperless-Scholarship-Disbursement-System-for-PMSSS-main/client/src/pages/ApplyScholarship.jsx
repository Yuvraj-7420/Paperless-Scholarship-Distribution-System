import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, UploadCloud, FileText, Plus, Loader } from 'lucide-react';
import api from '../api';
import './ApplyScholarship.css';

const STEPS = ['Personal Info', 'Academic Info', 'Select Scholarship', 'Documents', 'Review'];

const DocumentPicker = ({ label, documents, onUpload, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUpload();
      // Auto-select the newly uploaded file
      if (response.data && response.data.id) {
        onChange(String(response.data.id));
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`doc-picker-box card ${value ? 'selected' : ''}`}>
      <div className="flex justify-between items-center mb-1">
        <p className="font-medium">{label}</p>
        {value && <Check size={16} className="text-success" />}
      </div>
      <select 
        className="form-select mb-1" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select from uploaded...</option>
        {documents.map(doc => (
          <option key={doc.id} value={doc.id}>{doc.name}</option>
        ))}
      </select>
      <div className="upload-inline">
        <span>or</span>
        <div className="upload-btn-wrapper-sm">
          <button className="btn-link" disabled={uploading}>
            {uploading ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
            {uploading ? 'Uploading...' : 'Upload New'}
          </button>
          <input type="file" onChange={handleUpload} disabled={uploading} />
        </div>
      </div>
    </div>
  );
};

const ApplyScholarship = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const [userDocs, setUserDocs] = useState([]);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    aadhaar: '',
    address: '',
    collegeName: '',
    course: '',
    year: '1st Year',
    marks: '',
    scholarshipId: '',
    incomeCertId: '',
    marksheetId: '',
    aadhaarDocId: '',
    declaration: false
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const fetchUserDocs = async () => {
    try {
      const response = await api.get('/documents/my');
      setUserDocs(response.data);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [scholarshipsRes, profileRes] = await Promise.all([
          api.get('/scholarships'),
          api.get('/users/profile')
        ]);
        
        setScholarships(scholarshipsRes.data);
        
        // Pre-fill form from profile
        const profile = profileRes.data;
        setFormData(prev => ({
          ...prev,
          name: profile.name || '',
          email: profile.email || '',
          dob: profile.dob || '',
          aadhaar: profile.aadhaar || '',
          address: profile.address || ''
        }));

        // Auto-select scholarship if passed in URL
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) {
          setFormData(prev => ({ ...prev, scholarshipId: idFromUrl }));
        }
      } catch (err) {
        console.error("Failed to fetch initial data", err);
        const userData = localStorage.getItem('user');
        if (!userData) navigate('/login');
      }
    };
    
    fetchInitialData();
    fetchUserDocs();
  }, [navigate, searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.dob) newErrors.dob = 'Required';
      if (!formData.aadhaar) newErrors.aadhaar = 'Required';
      if (!formData.address) newErrors.address = 'Required';
    } else if (currentStep === 2) {
      if (!formData.collegeName) newErrors.collegeName = 'Required';
      if (!formData.course) newErrors.course = 'Required';
      if (!formData.marks) newErrors.marks = 'Required';
    } else if (currentStep === 3) {
      if (!formData.scholarshipId) newErrors.scholarshipId = 'Please select a scholarship';
    } else if (currentStep === 4) {
      if (!formData.incomeCertId) newErrors.incomeCertId = 'Required';
      if (!formData.marksheetId) newErrors.marksheetId = 'Required';
      if (!formData.aadhaarDocId) newErrors.aadhaarDocId = 'Required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitApplication = async () => {
    if (!formData.declaration) {
      alert("Please accept the declaration.");
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/applications', formData);
      alert('Application Submitted Successfully!');
      navigate('/applications');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-container">
      <div className="card">
        <h2 className="page-title">Apply for Scholarship</h2>
        
        {/* Step Indicator */}
        <div className="stepper">
          {STEPS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;
            
            return (
              <div key={step} className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="step-circle">
                  {isCompleted ? <Check size={16} /> : stepNum}
                </div>
                <span className="step-label">{step}</span>
                {index < STEPS.length - 1 && <div className="step-line"></div>}
              </div>
            );
          })}
        </div>

        <div className="form-content">
          {currentStep === 1 && (
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                   <label className="form-label">Full Name</label>
                   <input type="text" className="form-input" value={formData.name} readOnly />
                </div>
                <div className="form-group">
                   <label className="form-label">Email</label>
                   <input type="email" className="form-input" value={formData.email} readOnly />
                </div>
                <div className="form-group">
                   <label className="form-label">Date of Birth</label>
                   <input 
                    type="date" 
                    name="dob"
                    className={`form-input ${errors.dob ? 'error' : ''}`}
                    value={formData.dob}
                    onChange={handleInputChange}
                   />
                   {errors.dob && <span className="error-text">{errors.dob}</span>}
                </div>
                <div className="form-group">
                   <label className="form-label">Aadhaar Number</label>
                   <input 
                    type="text" 
                    name="aadhaar"
                    className={`form-input ${errors.aadhaar ? 'error' : ''}`}
                    placeholder="XXXX-XXXX-XXXX" 
                    value={formData.aadhaar}
                    onChange={handleInputChange}
                   />
                   {errors.aadhaar && <span className="error-text">{errors.aadhaar}</span>}
                </div>
              </div>
              <div className="form-group mt-1">
                <label className="form-label">Address</label>
                <textarea 
                  name="address"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  rows="3" 
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-section">
              <h3>Academic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">College Name</label>
                  <input 
                    type="text" 
                    name="collegeName"
                    className={`form-input ${errors.collegeName ? 'error' : ''}`}
                    placeholder="Current College/University" 
                    value={formData.collegeName}
                    onChange={handleInputChange}
                  />
                  {errors.collegeName && <span className="error-text">{errors.collegeName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Course</label>
                  <input 
                    type="text" 
                    name="course"
                    className={`form-input ${errors.course ? 'error' : ''}`}
                    placeholder="e.g. B.Tech Computer Science" 
                    value={formData.course}
                    onChange={handleInputChange}
                  />
                  {errors.course && <span className="error-text">{errors.course}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Year of Study</label>
                  <select 
                    name="year"
                    className="form-select"
                    value={formData.year}
                    onChange={handleInputChange}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Exam Marks (%)</label>
                  <input 
                    type="number" 
                    name="marks"
                    className={`form-input ${errors.marks ? 'error' : ''}`}
                    placeholder="e.g. 85" 
                    value={formData.marks}
                    onChange={handleInputChange}
                  />
                  {errors.marks && <span className="error-text">{errors.marks}</span>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-section">
              <h3>Select Scholarship</h3>
              <p className="text-secondary mb-1">Based on your profile, you are eligible for the following:</p>
              
              {errors.scholarshipId && <p className="error-text mb-1">{errors.scholarshipId}</p>}
              
              <div className="scholarship-options">
                {scholarships.length > 0 ? scholarships.map(scholarship => (
                  <label key={scholarship.id} className="scholarship-radio-card">
                    <input 
                      type="radio" 
                      name="scholarshipId" 
                      value={scholarship.id}
                      checked={String(formData.scholarshipId) === String(scholarship.id)}
                      onChange={handleInputChange}
                    />
                    <div className="card-content">
                      <span className={`badge ${scholarship.category === 'MERIT' ? 'badge-success' : 'badge-warning'} mb-1`}>
                        {scholarship.category}
                      </span>
                      <h4>{scholarship.name}</h4>
                      <p className="amount mt-1">₹{scholarship.amount}/year</p>
                    </div>
                  </label>
                )) : <p>Loading scholarships...</p>}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-section">
              <h3>Upload & Select Documents</h3>
              <p className="text-secondary mb-2">Select the required documents from your vault or upload new ones.</p>
              
              <div className="document-selection-grid">
                <div className="form-group">
                  <DocumentPicker 
                    label="Income Certificate" 
                    documents={userDocs} 
                    onUpload={fetchUserDocs}
                    value={formData.incomeCertId}
                    onChange={(val) => setFormData(prev => ({ ...prev, incomeCertId: val }))}
                  />
                  {errors.incomeCertId && <span className="error-text">{errors.incomeCertId}</span>}
                </div>
                <div className="form-group">
                  <DocumentPicker 
                    label="Previous Year Marksheet" 
                    documents={userDocs} 
                    onUpload={fetchUserDocs}
                    value={formData.marksheetId}
                    onChange={(val) => setFormData(prev => ({ ...prev, marksheetId: val }))}
                  />
                  {errors.marksheetId && <span className="error-text">{errors.marksheetId}</span>}
                </div>
                <div className="form-group">
                  <DocumentPicker 
                    label="ID Proof (Aadhaar)" 
                    documents={userDocs} 
                    onUpload={fetchUserDocs}
                    value={formData.aadhaarDocId}
                    onChange={(val) => setFormData(prev => ({ ...prev, aadhaarDocId: val }))}
                  />
                  {errors.aadhaarDocId && <span className="error-text">{errors.aadhaarDocId}</span>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="form-section">
              <h3>Review & Submit</h3>
              <div className="review-container">
                <div className="review-group card">
                  <h4>Personal Details</h4>
                  <div className="review-grid">
                    <div className="review-item"><span>Name:</span> {formData.name}</div>
                    <div className="review-item"><span>DOB:</span> {formData.dob}</div>
                    <div className="review-item"><span>Aadhaar:</span> {formData.aadhaar}</div>
                  </div>
                </div>

                <div className="review-group card mt-1">
                  <h4>Academic Details</h4>
                  <div className="review-grid">
                    <div className="review-item"><span>College:</span> {formData.collegeName}</div>
                    <div className="review-item"><span>Course:</span> {formData.course} ({formData.year})</div>
                    <div className="review-item"><span>Marks:</span> {formData.marks}%</div>
                  </div>
                </div>

                <div className="review-group card mt-1">
                  <h4>Scholarship</h4>
                  <div className="review-item">
                    <span>Selected:</span> {scholarships.find(s => String(s.id) === String(formData.scholarshipId))?.name}
                  </div>
                </div>
              </div>

              <div className="declaration mt-2">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="declaration"
                    checked={formData.declaration}
                    onChange={handleInputChange}
                  />
                  <span>I declare that all the information provided above is true to the best of my knowledge.</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            className="btn-secondary" 
            onClick={prevStep} 
            disabled={currentStep === 1 || loading}
          >
            Back
          </button>
          
          {currentStep < STEPS.length ? (
            <button className="btn-primary" onClick={nextStep} disabled={currentStep === 3 && !formData.scholarshipId}>
              Next Step
            </button>
          ) : (
            <button className="btn-primary" onClick={submitApplication} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyScholarship;
