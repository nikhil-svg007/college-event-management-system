import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, requireRole('student'), getRecommendations);

export default router;

