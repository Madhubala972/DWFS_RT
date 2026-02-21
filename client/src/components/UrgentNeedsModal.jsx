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
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="fixed bottom-5 right-5 z-50 max-w-sm w-full"
            >
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
                        <div className="flex items-center">
                            <span className="text-2xl mr-3">
                                {user?.role === 'admin' ? '📋' : '🚨'}
                            </span>
                            <h2 className="text-lg font-bold">{title}</h2>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-blue-100 hover:text-white transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-700 mb-6 text-sm">
                            {message}
                        </p>

                        {stats.urgentRequests && stats.urgentRequests.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm max-h-48 overflow-y-auto border border-gray-100">
                                <ul className="space-y-4">
                                    {stats.urgentRequests.map((req, index) => (
                                        <li key={index} className="border-b border-gray-100 last:border-0 pb-3">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-gray-900">
                                                    ● {req.type}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${req.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {req.priority}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 mt-1 text-xs">{req.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            {primaryAction}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-gray-500 hover:text-blue-600 font-bold text-xs text-center transition"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UrgentNeedsModal;
