import express from 'express';
import { getFlights, getFlightById, createFlight, updateFlight, deleteFlight } from '../controllers/flightController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getFlights).post(protect, admin, createFlight);
router.route('/:id').get(getFlightById).put(protect, admin, updateFlight).delete(protect, admin, deleteFlight);

export default router;
