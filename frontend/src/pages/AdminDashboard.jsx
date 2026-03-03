import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { LayoutDashboard, Plane, Users, PlusCircle, Trash2, TrendingUp, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('analytics');

    // Data State
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Flight State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newFlight, setNewFlight] = useState({
        flightNumber: '', airline: '', from: '', to: '', departureTime: '', arrivalTime: '', totalSeats: '', price: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [flightsRes, bookingsRes] = await Promise.all([
                api.get('/flights'),
                api.get('/bookings/all'),
            ]);
            setFlights(flightsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchData();
        }
    }, [user]);

    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // Analytics logic
    const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'Paid' && b.bookingStatus === 'Confirmed' && b.flightId)
        .reduce((sum, b) => sum + (b.flightId.price || 0), 0);
    const activeBookingsCount = bookings.filter(b => b.bookingStatus === 'Confirmed').length;

    // Handlers
    const handleAddFlight = async (e) => {
        e.preventDefault();
        try {
            await api.post('/flights', {
                ...newFlight,
                totalSeats: Number(newFlight.totalSeats),
                availableSeats: Number(newFlight.totalSeats),
                price: Number(newFlight.price)
            });
            setShowAddForm(false);
            setNewFlight({ flightNumber: '', airline: '', from: '', to: '', departureTime: '', arrivalTime: '', totalSeats: '', price: '' });
            fetchData();
        } catch (error) {
            alert('Failed to add flight');
        }
    };

    const handleDeleteFlight = async (id) => {
        if (window.confirm('Delete this flight?')) {
            try {
                await api.delete(`/flights/${id}`);
                fetchData();
            } catch (error) {
                alert('Failed to delete flight');
            }
        }
    };

    const handleAdminDownloadTicket = (booking) => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text('SkyReserve Airlines', 105, 20, null, null, 'center');

        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text('Flight Boarding Pass', 105, 30, null, null, 'center');

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        doc.text(`Passenger: ${booking.userId?.name || 'Guest'}`, 20, 50);
        doc.text(`Booking Ref: ${booking._id.substring(0, 8).toUpperCase()}`, 130, 50);

        if (booking.flightId) {
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Route: ${booking.flightId.from} to ${booking.flightId.to}`, 20, 70);

            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Airline: ${booking.flightId.airline}`, 20, 80);
            doc.text(`Flight Number: ${booking.flightId.flightNumber}`, 130, 80);

            const depDate = new Date(booking.flightId.departureTime);
            doc.text(`Departure Time: ${depDate.toLocaleString()}`, 20, 95);
        } else {
            doc.text(`Route: Flight has been deleted from system`, 20, 70);
        }

        doc.text(`Seats: ${booking.numberOfSeats || 1}`, 130, 95);
        doc.text(`Status: ${booking.bookingStatus}`, 20, 105);

        doc.setLineWidth(0.5);
        doc.line(20, 120, 190, 120);
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Thank you for flying with SkyReserve! Have a safe journey.', 105, 130, null, null, 'center');

        doc.save(`Admin_Ticket_${booking._id.substring(0, 8)}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold border-b pb-4 mb-6">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    <LayoutDashboard className="w-5 h-5" /> Analytics
                </button>
                <button onClick={() => setActiveTab('flights')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'flights' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    <Plane className="w-5 h-5" /> Manage Flights
                </button>
                <button onClick={() => setActiveTab('bookings')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    <Users className="w-5 h-5" /> All Bookings
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading admin data...</div>
            ) : (
                <>
                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                                <TrendingUp className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                <h3 className="text-lg font-medium text-slate-500">Total Revenue</h3>
                                <p className="text-3xl font-bold text-slate-900 mt-2">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                                <Users className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                                <h3 className="text-lg font-medium text-slate-500">Active Bookings</h3>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{activeBookingsCount}</p>
                            </div>
                            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm text-center">
                                <Plane className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                                <h3 className="text-lg font-medium text-slate-500">Total Flights</h3>
                                <p className="text-3xl font-bold text-slate-900 mt-2">{flights.length}</p>
                            </div>
                        </div>
                    )}

                    {/* FLIGHTS TAB */}
                    {activeTab === 'flights' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Flights Portfolio</h2>
                                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
                                    <PlusCircle className="w-5 h-5" /> {showAddForm ? 'Cancel' : 'Add Flight'}
                                </button>
                            </div>

                            {showAddForm && (
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                                    <h3 className="font-bold mb-4">Add New Flight</h3>
                                    <form onSubmit={handleAddFlight} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input type="text" placeholder="Flight No (e.g. SR105)" required value={newFlight.flightNumber} onChange={e => setNewFlight({ ...newFlight, flightNumber: e.target.value })} className="border p-2 rounded" />
                                        <input type="text" placeholder="Airline" required value={newFlight.airline} onChange={e => setNewFlight({ ...newFlight, airline: e.target.value })} className="border p-2 rounded" />

                                        <select required value={newFlight.from} onChange={e => setNewFlight({ ...newFlight, from: e.target.value })} className="border p-2 rounded bg-white">
                                            <option value="">Select Departure City</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Chennai">Chennai</option>
                                            <option value="Kolkata">Kolkata</option>
                                            <option value="Pune">Pune</option>
                                            <option value="Goa">Goa</option>
                                        </select>

                                        <select required value={newFlight.to} onChange={e => setNewFlight({ ...newFlight, to: e.target.value })} className="border p-2 rounded bg-white">
                                            <option value="">Select Arrival City</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                            <option value="Delhi">Delhi</option>
                                            <option value="Mumbai">Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Chennai">Chennai</option>
                                            <option value="Kolkata">Kolkata</option>
                                            <option value="Pune">Pune</option>
                                            <option value="Goa">Goa</option>
                                        </select>

                                        <input type="datetime-local" placeholder="Dep. Time" required value={newFlight.departureTime} onChange={e => setNewFlight({ ...newFlight, departureTime: e.target.value })} className="border p-2 rounded" />
                                        <input type="datetime-local" placeholder="Arr. Time" required value={newFlight.arrivalTime} onChange={e => setNewFlight({ ...newFlight, arrivalTime: e.target.value })} className="border p-2 rounded" />
                                        <input type="number" placeholder="Total Seats" required value={newFlight.totalSeats} onChange={e => setNewFlight({ ...newFlight, totalSeats: e.target.value })} className="border p-2 rounded" />
                                        <input type="number" placeholder="Price (₹)" required value={newFlight.price} onChange={e => setNewFlight({ ...newFlight, price: e.target.value })} className="border p-2 rounded" />
                                        <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 font-medium">Create Flight</button>
                                    </form>
                                </div>
                            )}

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Flight</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Route</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dep/Arr</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Seats</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {flights.map((f) => (
                                            <tr key={f._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-slate-900">{f.flightNumber}</div>
                                                    <div className="text-sm text-slate-500">{f.airline}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-slate-900">{f.from} → {f.to}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div>{new Date(f.departureTime).toLocaleDateString()}</div>
                                                    <div className="text-slate-500">{new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {f.availableSeats} / {f.totalSeats}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleDeleteFlight(f._id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="w-5 h-5 inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">All User Bookings</h2>
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Flight</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Seat</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {bookings.map((b) => (
                                            <tr key={b._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                    {new Date(b.bookingDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="font-medium text-slate-900">{b.userId?.name || 'N/A'}</div>
                                                    <div className="text-slate-500">{b.userId?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                                    {b.flightId ? `${b.flightId.flightNumber} (${b.flightId.from} → ${b.flightId.to})` : 'Deleted'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {b.numberOfSeats || 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.bookingStatus === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {b.bookingStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleAdminDownloadTicket(b)}
                                                        className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg"
                                                        title="Download Ticket PDF"
                                                    >
                                                        <Download className="w-5 h-5 inline" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
