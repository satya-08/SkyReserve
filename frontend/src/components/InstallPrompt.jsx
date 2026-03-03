import React, { useState, useEffect } from 'react';
import { DownloadCloud } from 'lucide-react';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setShowInstallBtn(false);
        }
        setDeferredPrompt(null);
    };

    if (!showInstallBtn) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
            <DownloadCloud className="w-4 h-4" />
            Install App
        </button>
    );
};

export default InstallPrompt;
