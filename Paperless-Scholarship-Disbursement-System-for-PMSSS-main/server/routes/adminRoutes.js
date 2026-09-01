import express from 'express';
import { getAllApplications, updateApplicationStatus, getAdminStats } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/applications', getAllApplications);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/stats', getAdminStats);

export default router;
