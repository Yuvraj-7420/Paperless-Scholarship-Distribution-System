import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/users.json');

// Helper to read users
const readUsers = () => {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath));
};

// Helper to write users
const writeUsers = (users) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
};

export const getProfile = (req, res) => {
  const users = readUsers();
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  // Don't send password
  const { password, ...userProfile } = user;
  res.json(userProfile);
};

export const updateProfile = (req, res) => {
  const users = readUsers();
  const index = users.findIndex(u => u.id === req.user.id);
  
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  
  // Update fields
  const updatedUser = {
    ...users[index],
    ...req.body,
    // Ensure ID and Email don't change through this endpoint for safety
    id: users[index].id,
    email: users[index].email,
    password: users[index].password // Keep existing hashed password
  };
  
  users[index] = updatedUser;
  writeUsers(users);
  
  const { password, ...userProfile } = updatedUser;
  res.json(userProfile);
};
