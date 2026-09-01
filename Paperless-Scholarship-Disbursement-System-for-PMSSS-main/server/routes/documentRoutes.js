import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadDocument, getMyDocuments, deleteDocument } from '../controllers/documentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);
router.get('/my', authMiddleware, getMyDocuments);
router.delete('/:id', authMiddleware, deleteDocument);

export default router;
