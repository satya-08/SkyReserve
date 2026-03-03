import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

const BookFlight = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [seats, setSeats] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchFlight = async () => {
            try {
                const { data } = await api.get(`/flights/${id}`);
                setFlight(data);
            } catch (err) {
                setError('Failed to load flight details');
            }
        };
        fetchFlight();
    }, [id, user, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (seats < 1) {
            setError('Please select at least 1 seat');
            return;
        }
        setIsProcessing(true);
        // Simulate dummy payment delay
        setTimeout(async () => {
            try {
                await api.post('/bookings', { flightId: id, numberOfSeats: seats });
                setIsProcessing(false);
                navigate('/dashboard');
            } catch (err) {
                setIsProcessing(false);
                setError(err.response?.data?.message || 'Booking failed');
            }
        }, 1500);
    };

    if (error) return <div className="p-12 text-center text-red-600 font-bold">{error}</div>;
    if (!flight) return <div className="p-12 text-center">Loading flight...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Complete your booking</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Flight Summary */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Flight Review</h3>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">{flight.from}</span>
                            <ChevronRight className="text-slate-400" />
                            <span className="text-lg font-semibold">{flight.to}</span>
                        </div>
                        <p className="text-slate-600 mb-1">{flight.airline} • {flight.flightNumber}</p>
                        <p className="text-sm text-slate-500 mb-4">
                            Departure: {new Date(flight.departureTime).toLocaleString()}
                        </p>
                        <div className="flex bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4 items-center">
                            <ShieldCheck className="w-5 h-5 mr-2" />
                            This flight is {flight.status.toLowerCase()} and ready.
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Seats</label>
                            <input
                                type="number"
                                min="1"
                                max={flight.availableSeats}
                                value={seats}
                                onChange={(e) => setSeats(Number(e.target.value))}
                                className="block w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <p className="text-xs text-slate-500 mt-1">{flight.availableSeats} seats left</p>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Payment Details</h3>

                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-600">Base Fare ({seats} x ₹{flight.price})</span>
                            <span className="font-medium">₹{flight.price * seats}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <span className="text-slate-600">Taxes & Fees</span>
                            <span className="font-medium">₹{Math.floor((flight.price * seats) * 0.1)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-bold text-slate-900">Total</span>
                            <span className="text-2xl font-extrabold text-blue-600">
                                ₹{(flight.price * seats) + Math.floor((flight.price * seats) * 0.1)}
                            </span>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg shadow-sm text-lg font-medium text-white transition-colors ${isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isProcessing ? 'Processing Securely...' : (
                                <>
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Pay Now
                                </>
                            )}
                        </button>
                        <p className="text-xs text-center text-slate-400 mt-4">
                            This is a dummy payment. No real card is needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookFlight;
