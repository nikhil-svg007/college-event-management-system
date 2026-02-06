import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

router.post('/', protect, requireRole('society_admin'), upload.single('poster'), createEvent);
router.put('/:id', protect, requireRole('society_admin'), upload.single('poster'), updateEvent);
router.delete('/:id', protect, requireRole('society_admin'), deleteEvent);

export default router;

