import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GoBackButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show on home page as it's the root
    if (location.pathname === '/') return null;

    return (
        <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4 px-4 py-2 hover:bg-slate-100 rounded-lg w-fit font-medium"
            aria-label="Go back to Home"
        >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
        </button>
    );
};

export default GoBackButton;
