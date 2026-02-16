import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UrgentNeedsModal = () => {
    const [stats, setStats] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get user from local storage to customize message
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/requests/stats');

                // Logic to show modal based on user role and stats
                let shouldShow = false;

                if (user?.role === 'admin') {
                    // Admin should see if there are ANY pending requests
                    if (data.byStatus?.Pending > 0) shouldShow = true;
                } else if (user?.role === 'volunteer') {
                    // Volunteers should see if there are requests
                    if (data.byStatus?.Pending > 0) shouldShow = true;
                } else {
                    // Public/Guests
                    if (data.byStatus?.Pending > 0) shouldShow = true;
                }

                if (shouldShow) {
                    setStats(data);
                    // Show modal after a short delay
                    setTimeout(() => setIsVisible(true), 1500);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };

        fetchStats();
    }, [user?.role]);

    if (!isVisible || !stats) return null;

    // Custom Content Based on Role
    // Safely access properties with optional chaining and defaults
    const pendingCount = stats.byStatus?.Pending || 0;
    const criticalCount = stats.byPriority?.Critical || 0;
    const highCount = stats.byPriority?.High || 0;

    let title = "Urgent Help Needed!";
    let message = (
        <span>There are currently <strong className="text-red-600">{pendingCount} requests</strong> waiting for assistance in your area.</span>
    );
    let primaryAction = (
        <Link to="/register" className="w-full btn-primary text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition">
            Register as Volunteer
        </Link>
    );

    if (user?.role === 'admin') {
        title = "Action Required";
        message = (
            <span>There are <strong className="text-red-600">{pendingCount} pending requests</strong> needing your approval/verification.</span>
        );
        primaryAction = (
            <button
                onClick={() => {
                    setIsVisible(false);
                    if (location.pathname !== '/dashboard') navigate('/dashboard');
                }}
                className="w-full btn-primary text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition"
            >
                Review Requests
            </button>
        );
    } else if (user?.role === 'volunteer') {
        title = "New Tasks Available";
        message = (
            <span>There are <strong className="text-red-600">{pendingCount} requests</strong> that need assistance.</span>
        );
        primaryAction = (
            <button
                onClick={() => {
                    setIsVisible(false);
                    if (location.pathname !== '/dashboard') navigate('/dashboard');
                }}
                className="w-full btn-primary text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition"
            >
                View Tasks
            </button>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className="fixed bottom-5 right-5 z-50 max-w-sm w-full"
            >
                <div className="bg-white rounded-lg shadow-2xl p-6 border-l-8 border-red-500 relative">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>

                    <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">
                            {user?.role === 'admin' ? '📋' : '🚨'}
                        </span>
                        <h2 className="text-xl font-bold text-red-600">{title}</h2>
                    </div>

                    <p className="text-gray-700 mb-4 text-sm">
                        {message}
                    </p>

                    {stats.urgentRequests && stats.urgentRequests.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-md mb-4 text-sm max-h-60 overflow-y-auto">
                            <ul className="space-y-3">
                                {stats.urgentRequests.map((req, index) => (
                                    <li key={index} className="border-b border-red-200 last:border-0 pb-2">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-red-800 flex items-center gap-1">
                                                {req.priority === 'Critical' ? '⚠️' : '🆘'} {req.type}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${req.priority === 'Critical' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'
                                                }`}>
                                                {req.priority}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 mt-1 text-xs font-medium">{req.description}</p>
                                        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                                            <span>📍 {req.location?.city || req.location?.address || 'Location Hidden'}</span>
                                            <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        {primaryAction}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:underline text-xs text-center"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UrgentNeedsModal;
