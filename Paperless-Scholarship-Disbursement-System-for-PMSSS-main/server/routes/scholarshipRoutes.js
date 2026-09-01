import express from 'express';
import { getScholarships } from '../controllers/scholarshipController.js';

const router = express.Router();

router.get('/', getScholarships);

export default router;
