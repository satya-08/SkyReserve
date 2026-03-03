import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Calendar, MapPin, PlaneTakeoff, Armchair } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFlights = async (searchParams = {}) => {
        setLoading(true);
        try {
            const { data } = await api.get('/flights', { params: searchParams });
            setFlights(data);
        } catch (error) {
            console.error('Error fetching flights', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFlights(); // Load all upcoming initially
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchFlights({ from, to, date });
    };

    const handleBook = (flightId) => {
        navigate(`/book/${flightId}`);
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Where will you fly next?
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl mb-10">
                        Discover and book the best flights to your dream destinations.
                    </p>

                    {/* Search Box */}
                    <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 p-4 text-slate-900 border border-slate-200">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">From</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        value={from}
                                        onChange={(e) => setFrom(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="">Any City</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Kolkata">Kolkata</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Goa">Goa</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">To</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PlaneTakeoff className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                                    >
                                        <option value="">Any City</option>
                                        <option value="Hyderabad">Hyderabad</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Mumbai">Mumbai</option>
                                        <option value="Bangalore">Bangalore</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Kolkata">Kolkata</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Goa">Goa</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <Search className="w-5 h-5 mr-2" />
                                    Search Flights
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Available Flights</h2>

                {loading ? (
                    <div className="text-center py-10">Loading flights...</div>
                ) : flights.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
                        <PlaneTakeoff className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 text-lg">No flights found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {flights.map((flight) => (
                            <div key={flight._id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex-1 w-full md:w-auto grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                                    {/* Airline & Number */}
                                    <div className="col-span-1">
                                        <p className="font-bold text-slate-900">{flight.airline}</p>
                                        <p className="text-sm text-slate-500">{flight.flightNumber}</p>
                                    </div>

                                    {/* Departure */}
                                    <div className="col-span-1 text-center md:text-left">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-slate-600">{flight.from}</p>
                                        <p className="text-xs text-slate-500 block md:hidden">{new Date(flight.departureTime).toLocaleDateString()}</p>
                                    </div>

                                    {/* Duration Line */}
                                    <div className="col-span-1 hidden md:flex flex-col items-center px-4">
                                        <p className="text-xs text-slate-500 text-center mb-1">{new Date(flight.departureTime).toLocaleDateString()}</p>
                                        <div className="w-full flex items-center">
                                            <div className="h-px bg-slate-300 flex-1"></div>
                                            <PlaneTakeoff className="w-4 h-4 text-slate-400 mx-2" />
                                            <div className="h-px bg-slate-300 flex-1"></div>
                                        </div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="col-span-1 text-center md:text-left">
                                        <p className="text-2xl font-bold text-slate-900">
                                            {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-slate-600">{flight.to}</p>
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="mt-6 md:mt-0 flex flex-row md:flex-col items-center justify-between w-full md:w-auto md:ml-8 md:pl-8 md:border-l border-slate-200">
                                    <div className="text-left md:text-right mb-0 md:mb-4">
                                        <p className="text-3xl font-extrabold text-slate-900">₹{flight.price}</p>
                                        <p className="text-sm text-green-600 flex items-center mt-1">
                                            <Armchair className="w-4 h-4 mr-1" />
                                            {flight.availableSeats} seats left
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleBook(flight._id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
