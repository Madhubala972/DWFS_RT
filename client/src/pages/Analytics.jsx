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

            {/* Lifecycle Line Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* 1. Request Creation Timeline */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
                    <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Request Influx
                    </h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-2xl font-black text-gray-800">{timelineData.reduce((acc, curr) => acc + curr.requests, 0)}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">New Requests (7D)</p>
                </div>

                {/* 2. Processing Timeline */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-orange-50">
                    <h3 className="text-sm font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        Inventory Movement
                    </h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="processing" stroke="#f97316" strokeWidth={4} dot={{ r: 4, fill: '#f97316' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-2xl font-black text-gray-800">{timelineData.reduce((acc, curr) => acc + curr.processing, 0)}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">In Processing (7D)</p>
                </div>

                {/* 3. Delivery Success Timeline */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-50">
                    <h3 className="text-sm font-black text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Successful Deliveries
                    </h3>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="delivery" stroke="#22c55e" strokeWidth={4} dot={{ r: 4, fill: '#22c55e' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-2xl font-black text-gray-800">{timelineData.reduce((acc, curr) => acc + curr.delivery, 0)}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">Completed (7D)</p>
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
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Requests by Type</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={typeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#82ca9d" name="Number of Requests" barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
