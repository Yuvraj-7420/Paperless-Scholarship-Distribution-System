import express from 'express';
import { createApplication, getMyApplications } from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createApplication);
router.get('/my', authMiddleware, getMyApplications);

export default router;
