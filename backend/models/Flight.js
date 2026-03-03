import mongoose from 'mongoose';

const flightSchema = mongoose.Schema(
    {
        flightNumber: { type: String, required: true, unique: true },
        airline: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        departureTime: { type: Date, required: true },
        arrivalTime: { type: Date, required: true },
        totalSeats: { type: Number, required: true },
        availableSeats: { type: Number, required: true },
        price: { type: Number, required: true },
        status: { type: String, enum: ['Scheduled', 'Delayed', 'Cancelled'], default: 'Scheduled' },
    },
    {
        timestamps: true,
    }
);

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
