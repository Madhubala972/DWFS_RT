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
        <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
                    <FaRobot className="text-primary" /> AI Strategy & Performance
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Comprehensive metrics and developmental notes for our AI-driven disaster response system.
                </p>
            </motion.div>

            {/* Performance Metric Graph */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 mb-12"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" /> Accuracy Growth Curve (%)
                </h2>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="phase" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} domain={[60, 100]} />
                            <Tooltip
                                cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorAcc)" dot={{ r: 6, fill: '#2563eb', strokeWidth: 3, stroke: '#fff' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-t border-gray-50 pt-8">
                    <div>
                        <p className="text-3xl font-black text-primary">96%</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Peak Accuracy</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-green-600">0.2s</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Inference Time</p>
                    </div>
                    <div>
                        <p className="text-3xl font-black text-purple-600">10k+</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Trained Samples</p>
                    </div>
                </div>
            </motion.div>



            {/* Bottom Insight Section */}
            <div className="mt-12 p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <FaServer className="text-9xl" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-2xl font-bold mb-3">AI Governance & Scalability</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Our architecture ensures that all AI prioritizations are transparently logged with full audit trails. The modular Flask service is designed to auto-scale, handling hyper-local disasters as effectively as regional crises.
                        </p>
                    </div>
                    <Link to="/audit-logs" className="px-8 py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all whitespace-nowrap">
                        View Audit Logs
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AIPrioritization;
