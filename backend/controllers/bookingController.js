import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { flightId, numberOfSeats = 1 } = req.body;

    try {
        const flight = await Flight.findById(flightId);

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        if (flight.availableSeats < numberOfSeats) {
            return res.status(400).json({ message: 'Not enough seats available on this flight' });
        }

        const booking = new Booking({
            userId: req.user._id,
            flightId,
            numberOfSeats,
            bookingStatus: 'Confirmed',
            paymentStatus: 'Paid',
        });

        const createdBooking = await booking.save();

        // Update available seats
        flight.availableSeats -= numberOfSeats;
        await flight.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user._id }).populate('flightId');
    res.json(bookings);
};

// @desc    Get all bookings
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
    const bookings = await Booking.find({}).populate('userId', 'id name email').populate('flightId');
    res.json(bookings);
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check user owns booking or is admin
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to cancel this booking' });
        }

        const flight = await Flight.findById(booking.flightId);

        await booking.deleteOne();

        if (flight) {
            flight.availableSeats += booking.numberOfSeats;
            await flight.save();
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createBooking, getUserBookings, getAllBookings, cancelBooking };
