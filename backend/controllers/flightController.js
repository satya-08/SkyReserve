import Flight from '../models/Flight.js';

// @desc    Fetch all flights or search flights
// @route   GET /api/flights
// @access  Public
const getFlights = async (req, res) => {
    const { from, to, date } = req.query;

    let query = {};
    if (from) query.from = { $regex: new RegExp(from, 'i') };
    if (to) query.to = { $regex: new RegExp(to, 'i') };
    if (date) {
        const searchDate = new Date(date);
        const nextDate = new Date(searchDate);
        nextDate.setDate(searchDate.getDate() + 1);
        query.departureTime = { $gte: searchDate, $lt: nextDate };
    }

    const flights = await Flight.find(query);
    res.json(flights);
};

// @desc    Fetch single flight
// @route   GET /api/flights/:id
// @access  Public
const getFlightById = async (req, res) => {
    const flight = await Flight.findById(req.params.id);

    if (flight) {
        res.json(flight);
    } else {
        res.status(404).json({ message: 'Flight not found' });
    }
};

// @desc    Create a flight
// @route   POST /api/flights
// @access  Private/Admin
const createFlight = async (req, res) => {
    const flight = new Flight({
        ...req.body,
    });

    try {
        const createdFlight = await flight.save();
        res.status(201).json(createdFlight);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
const updateFlight = async (req, res) => {
    const flight = await Flight.findById(req.params.id);

    if (flight) {
        Object.assign(flight, req.body);
        const updatedFlight = await flight.save();
        res.json(updatedFlight);
    } else {
        res.status(404).json({ message: 'Flight not found' });
    }
};

// @desc    Delete a flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
const deleteFlight = async (req, res) => {
    const flight = await Flight.findById(req.params.id);

    if (flight) {
        await flight.deleteOne();
        res.json({ message: 'Flight removed' });
    } else {
        res.status(404).json({ message: 'Flight not found' });
    }
};

export { getFlights, getFlightById, createFlight, updateFlight, deleteFlight };
