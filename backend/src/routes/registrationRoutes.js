import express from 'express';
import {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations
} from '../controllers/registrationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:eventId', protect, requireRole('student'), registerForEvent);
router.get('/my', protect, requireRole('student'), getMyRegistrations);
router.get('/event/:eventId', protect, requireRole('society_admin'), getEventRegistrations);

export default router;

