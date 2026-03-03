import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        flightId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Flight' },
        numberOfSeats: { type: Number, required: true, default: 1 },
        bookingStatus: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
        paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Paid' },
        bookingDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
