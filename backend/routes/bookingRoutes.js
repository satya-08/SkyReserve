import express from 'express';
import { createBooking, getUserBookings, getAllBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking).get(protect, getUserBookings);
router.route('/all').get(protect, admin, getAllBookings);
router.route('/:id').delete(protect, cancelBooking);

export default router;
