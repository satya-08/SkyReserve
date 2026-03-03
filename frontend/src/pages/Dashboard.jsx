import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Ticket, XCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await api.delete(`/bookings/${bookingId}`);
                fetchBookings();
            } catch (error) {
                alert('Failed to cancel booking');
            }
        }
    };

    const handleDownloadTicket = (booking) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Blue-600
        doc.text('SkyReserve Airlines', 105, 20, null, null, 'center');

        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42); // Slate-900
        doc.text('Flight Boarding Pass', 105, 30, null, null, 'center');

        // Line separator
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        // Passengers & Flight Details
        doc.setFontSize(12);
        doc.text(`Passenger: ${user.name}`, 20, 50);
        doc.text(`Booking Ref: ${booking._id.substring(0, 8).toUpperCase()}`, 130, 50);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Route: ${booking.flightId?.from} to ${booking.flightId?.to}`, 20, 70);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Airline: ${booking.flightId?.airline}`, 20, 80);
        doc.text(`Flight Number: ${booking.flightId?.flightNumber}`, 130, 80);

        const depDate = new Date(booking.flightId?.departureTime);
        doc.text(`Departure Time: ${depDate.toLocaleString()}`, 20, 95);
        doc.text(`Seats Booked: ${booking.numberOfSeats || 1}`, 130, 95);
        doc.text(`Status: ${booking.bookingStatus}`, 20, 105);

        // Footer
        doc.setLineWidth(0.5);
        doc.line(20, 120, 190, 120);
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text('Thank you for flying with SkyReserve! Have a safe journey.', 105, 130, null, null, 'center');

        doc.save(`SkyReserve_Ticket_${booking._id.substring(0, 8)}.pdf`);
    };

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center gap-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
                    <p className="text-slate-500">{user.email}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Bookings</h2>

            {loading ? (
                <div>Loading your bookings...</div>
            ) : bookings.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                    <Ticket className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-lg">You have no flight bookings yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {booking.bookingStatus}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {booking.flightId?.from} to {booking.flightId?.to}
                                </h3>
                                <p className="text-slate-600">
                                    {booking.flightId?.airline} • {booking.flightId?.flightNumber}
                                </p>
                                <div className="mt-2 text-sm text-slate-700">
                                    <span className="font-medium">Departure:</span> {new Date(booking.flightId?.departureTime).toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-700">
                                    <span className="font-medium">Number of Seats:</span> {booking.numberOfSeats || 1}
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0 flex flex-col gap-3">
                                <button
                                    onClick={() => handleDownloadTicket(booking)}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Ticket
                                </button>
                                {booking.bookingStatus === 'Confirmed' && (
                                    <button
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none transition-colors"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
