import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/documents.json');

// Helper to read/write data
const readData = () => {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath));
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

export const uploadDocument = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const userId = req.user.id;
  const documents = readData();

  const newDoc = {
    id: Date.now(),
    userId,
    name: req.file.originalname,
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
    uploadDate: new Date().toISOString()
  };

  documents.push(newDoc);
  writeData(documents);

  res.status(201).json(newDoc);
};

export const getMyDocuments = (req, res) => {
  const userId = req.user.id;
  const documents = readData();
  const myDocs = documents.filter(d => d.userId === userId);
  res.json(myDocs);
};

export const deleteDocument = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  let documents = readData();

  const docIndex = documents.findIndex(d => String(d.id) === String(id) && d.userId === userId);
  if (docIndex === -1) {
    return res.status(404).json({ message: 'Document not found' });
  }

  // Delete file from disk
  const doc = documents[docIndex];
  const filePath = path.join(__dirname, '../uploads', doc.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  documents.splice(docIndex, 1);
  writeData(documents);

  res.json({ message: 'Document deleted successfully' });
};
