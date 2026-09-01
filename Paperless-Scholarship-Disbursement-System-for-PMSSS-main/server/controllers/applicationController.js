import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/applications.json');
const scholarshipPath = path.join(__dirname, '../data/scholarships.json');

// Helper to read data
const readData = (p) => {
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p));
};

// Helper to write data
const writeData = (p, data) => {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
};

export const createApplication = (req, res) => {
  const { scholarshipId } = req.body;
  const userId = req.user.id;
  
  const applications = readData(dataPath);
  const scholarships = readData(scholarshipPath);
  
  const scholarship = scholarships.find(s => String(s.id) === String(scholarshipId));
  if (!scholarship) {
    return res.status(404).json({ message: 'Scholarship not found' });
  }

  // Check if already applied
  if (applications.find(a => a.userId === userId && String(a.scholarshipId) === String(scholarshipId))) {
    return res.status(400).json({ message: 'You have already applied for this scholarship' });
  }

  const newApplication = {
    ...req.body, // Capture all form data (name, college, marks, etc.)
    id: Date.now(),
    userId,
    scholarshipId,
    scholarshipName: scholarship.name,
    status: 'PENDING',
    appliedDate: new Date().toISOString()
  };

  applications.push(newApplication);
  writeData(dataPath, applications);

  res.status(201).json(newApplication);
};

export const getMyApplications = (req, res) => {
  const userId = req.user.id;
  const applications = readData(dataPath);
  const myApps = applications.filter(a => a.userId === userId);
  res.json(myApps);
};
