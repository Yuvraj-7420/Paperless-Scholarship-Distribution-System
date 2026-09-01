import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/scholarships.json');

export const getScholarships = (req, res) => {
  if (!fs.existsSync(dataPath)) return res.json([]);
  const data = fs.readFileSync(dataPath);
  res.json(JSON.parse(data));
};
