import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import SummaryCards from '../components/analytics/SummaryCards';
import VerificationScorecards from '../components/analytics/VerificationScorecards';
import TrendsSection from '../components/analytics/TrendsSection';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [timeframe, setTimeframe] = useState('week');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) { navigate('/login'); return; }
            if (user.role !== 'admin') { setAccessDenied(true); return; }

            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/requests/stats?timeframe=${timeframe}`, config);
                setStats(data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) navigate('/login');
            }
        };
        fetchStats();
    }, [navigate, timeframe]);

    if (accessDenied) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-red-200">
                    <div className="text-5xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">This page is restricted to Administrators only.</p>
                    <Link to="/" className="btn-primary">Return Home</Link>
                </div>
            </div>
        );
    }

    if (!stats) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

    const priorityData = Object.entries(stats.byPriority).map(([name, value]) => ({ name, value }));
    const timelineData = stats.timeline || [];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-blue-600 text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Platform <span className="text-blue-200">Analytics</span>
                    </h1>
                    <p className="text-blue-100 mt-2">Real-time governance insights and distribution metrics.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20">
                <SummaryCards stats={stats} />
                <VerificationScorecards stats={stats} />
                <TrendsSection timeframe={timeframe} setTimeframe={setTimeframe} timelineData={timelineData} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Priority Volume Analysis</h2>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" stroke="#64748b" fontSize={12} />
                                    <YAxis dataKey="name" type="category" width={100} stroke="#64748b" fontSize={12} tick={{ fill: '#1f2937', fontWeight: 600 }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="value" name="Total Cases" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Critical' ? '#dc2626' : entry.name === 'High' ? '#ea580c' : '#2563eb'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-blue-700 text-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-2">Efficiency Rating</h3>
                        <p className="text-blue-200 text-sm mb-6">Aggregate performance across all categories based on verified completions.</p>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2 font-semibold">
                                    <span>Completion Rate</span>
                                    <span>{Math.round(((stats.byStatus['Delivered'] || 0) / stats.total) * 100)}%</span>
                                </div>
                                <div className="w-full bg-blue-800 rounded-full h-2">
                                    <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.round(((stats.byStatus['Delivered'] || 0) / stats.total) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-blue-600">
                                <p className="text-xs text-blue-200 uppercase font-black tracking-widest mb-1">Top Resource Needed</p>
                                <p className="text-2xl font-bold">
                                    {Object.entries(stats.byType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
