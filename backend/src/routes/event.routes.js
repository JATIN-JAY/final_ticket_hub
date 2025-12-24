import express from 'express';
import {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventSeats,
} from '../controllers/event.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllEvents).post(protect, admin, createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

router.get('/:id/seats', getEventSeats);

export default router;
