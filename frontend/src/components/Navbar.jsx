import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plane, LogOut, User } from 'lucide-react';
import InstallPrompt from './InstallPrompt';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Plane className="h-8 w-8 text-blue-600" />
                            <span className="font-bold text-xl text-slate-900 tracking-tight hidden sm:block">SkyReserve</span>
                        </Link>
                        <InstallPrompt />
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors border border-slate-200 hover:border-red-100 bg-white hover:bg-red-50 px-3 py-1.5 rounded-lg"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
