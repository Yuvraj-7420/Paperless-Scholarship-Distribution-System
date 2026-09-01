import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/applications.json');

const readData = () => {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath));
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

export const getAllApplications = (req, res) => {
  const applications = readData();
  res.json(applications);
};

export const updateApplicationStatus = (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;
  
  let applications = readData();
  const index = applications.findIndex(a => String(a.id) === String(id));
  
  if (index === -1) return res.status(404).json({ message: 'Application not found' });
  
  applications[index] = {
    ...applications[index],
    status,
    adminRemarks: remarks,
    updatedAt: new Date().toISOString()
  };
  
  writeData(applications);
  res.json(applications[index]);
};

export const getAdminStats = (req, res) => {
  const applications = readData();
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
    totalDisbursed: applications
      .filter(a => a.status === 'APPROVED')
      .reduce((sum, a) => sum + 1, 0) // Placeholder for amount summation if needed
  };
  res.json(stats);
};
