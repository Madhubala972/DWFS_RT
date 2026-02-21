import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaChartLine, FaCheckCircle, FaRocket, FaClock, FaShieldAlt, FaServer } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useNavigate, Link } from 'react-router-dom';

const AIPrioritization = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-red-200">
                    <div className="text-5xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">AI Strategy is restricted to Administrators only.</p>
                    <Link to="/" className="btn-primary">Return Home</Link>
                </div>
            </div>
        );
    }

    const performanceData = [
        { phase: 'Phase 1', accuracy: 72 },
        { phase: 'Phase 2', accuracy: 85 },
        { phase: 'Phase 3', accuracy: 91 },
        { phase: 'Retraining', accuracy: 94 },
        { phase: 'Live', accuracy: 96 },
    ];



    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="bg-blue-600 text-white py-12 mb-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
                        <FaRobot className="text-blue-200" /> AI Strategy & <span className="text-blue-200">Performance</span>
                    </h1>
                    <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
                        Metrics and developmental notes for our AI-driven disaster response system.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12">

                {/* Bottom Insight Section */}
                <div className="mt-12 p-8 bg-white border border-gray-100 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Governance & Scalability</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Our architecture ensures that all AI prioritizations are transparently logged with full audit trails. The system is designed to scale effectively, handling both local and regional crises.
                        </p>
                    </div>
                    <Link to="/audit-logs" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all whitespace-nowrap">
                        View Audit Logs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AIPrioritization;
