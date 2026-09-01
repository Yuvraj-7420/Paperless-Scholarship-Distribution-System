import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/users.json');

// Helper to read users
const readUsers = () => {
  if (!fs.existsSync(dataPath)) return [];
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// Helper to write users
const writeUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword, role: role || 'ROLE_STUDENT' };
  
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Special check for Admin Login
  if (email === 'admin' && password === '1234') {
    const adminToken = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1d' });
    return res.json({
      token: adminToken,
      id: 'admin',
      name: 'System Admin',
      email: 'admin@govscholar.com',
      role: 'admin'
    });
  }

  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });

  res.json({
    token,
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};
