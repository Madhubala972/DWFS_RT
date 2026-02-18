import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [accessDenied, setAccessDenied] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user) {
                navigate('/login');
                return;
            }

            // STRICT ADMIM CHECK
            if (user.role !== 'admin') {
                setAccessDenied(true);
                return;
            }

            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/requests/stats', config);
                setStats(data);
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchStats();
    }, [navigate]);

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

    // Data preparation for Recharts
    const typeData = Object.entries(stats.byType).map(([name, value]) => ({ name, value }));
    const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));
    const priorityData = Object.entries(stats.byPriority).map(([name, value]) => ({ name, value }));
    const timelineData = stats.timeline || [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Platform Analytics (Admin View)</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm uppercase tracking-wider">Total Requests</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm uppercase tracking-wider">Critical Cases</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.byPriority['Critical'] || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm uppercase tracking-wider">Delivered</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.byStatus['Delivered'] || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm uppercase tracking-wider">Pending</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.byStatus['Pending'] || 0}</p>
                </div>
            </div>

            {/* Trends Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Delivery Trends (Last 7 Days)</h2>
                <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Line type="monotone" dataKey="delivery" name="Completed Deliveries" stroke="#22c55e" strokeWidth={4} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Priority Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Priority Distribution</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" barSize={30}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Critical' ? '#ef4444' : entry.name === 'High' ? '#f97316' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Request Types */}
            </div>

            {/* Verification & Fairness Insights */}
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2 mt-8 mb-12">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                            <span className="text-blue-500">🛡️</span> Verified Requests Analysis
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Ensuring fairness and trust by validating every request before distribution.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Pending Verification */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100 flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-800 mb-1">Pending Verification</h3>
                        <p className="text-xs text-yellow-600 mb-2 uppercase tracking-wide font-medium">Under Review</p>
                        <span className="text-3xl font-bold text-yellow-900">
                            {stats.byStatus ? (stats.byStatus['Pending'] || 0) : 0}
                        </span>
                    </div>

                    {/* Verified & Active */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="text-lg font-semibold text-blue-800 mb-1">Verified & Approved</h3>
                        <p className="text-xs text-blue-600 mb-2 uppercase tracking-wide font-medium">Authenticity Checked</p>
                        <span className="text-3xl font-bold text-blue-900">
                            {stats.byStatus ? ['Verified', 'Approved', 'Assigned', 'InProgress', 'Collected', 'Delivered']
                                .reduce((sum, status) => sum + (stats.byStatus[status] || 0), 0) : 0}
                        </span>
                    </div>

                    {/* Rejected */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col items-center text-center shadow-sm">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">❌</span>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-1">Rejected</h3>
                        <p className="text-xs text-red-600 mb-2 uppercase tracking-wide font-medium">Flagged Invalid/Fraud</p>
                        <span className="text-3xl font-bold text-red-900">
                            {stats.byStatus ? (stats.byStatus['Rejected'] || 0) : 0}
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <span>🤖</span> Fraud Detection & AI Verification Process:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-disc list-inside text-sm text-gray-600">
                        <li>AI automatically checks for duplicate requests and unusual patterns.</li>
                        <li>Identity proofs (Aadhaar/ID) and income details are cross-referenced.</li>
                        <li>Location proof via geolocation ensures aid reaches the right area.</li>
                        <li>Only verified requests move to the prioritization queue for distribution.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
