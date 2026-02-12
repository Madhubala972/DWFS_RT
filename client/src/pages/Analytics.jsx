import { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            if (user.role !== 'admin') {
                // Simple redirection or error for now
                window.location.href = '/dashboard';
                return;
            }

            try {
                // Fetch all requests to calculate stats locally for MVP
                // In production, create specific aggregation endpoint
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/requests', config);

                const total = data.length;
                const byType = {};
                const byStatus = {};
                const byPriority = {};

                data.forEach(req => {
                    byType[req.type] = (byType[req.type] || 0) + 1;
                    byStatus[req.status] = (byStatus[req.status] || 0) + 1;
                    byPriority[req.priority] = (byPriority[req.priority] || 0) + 1;
                });

                setStats({ total, byType, byStatus, byPriority });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-10">Loading Stats...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Data Analysis</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card bg-blue-50 border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-700">Total Requests</h3>
                    <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="card bg-red-50 border-red-100">
                    <h3 className="text-lg font-semibold text-red-700">Critical Cases</h3>
                    <p className="text-4xl font-bold text-red-900">{stats.byPriority['Critical'] || 0}</p>
                </div>
                <div className="card bg-green-50 border-green-100">
                    <h3 className="text-lg font-semibold text-green-700">Delivered</h3>
                    <p className="text-4xl font-bold text-green-900">{stats.byStatus['Delivered'] || 0}</p>
                </div>
                <div className="card bg-yellow-50 border-yellow-100">
                    <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
                    <p className="text-4xl font-bold text-yellow-900">{stats.byStatus['Pending'] || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Requests by Type</h2>
                    <div className="space-y-4">
                        {Object.entries(stats.byType).map(([type, count]) => (
                            <div key={type}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">{type}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Priority Distribution</h2>
                    <div className="space-y-4">
                        {Object.entries(stats.byPriority).map(([prio, count]) => (
                            <div key={prio}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium">{prio}</span>
                                    <span>{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`h-2.5 rounded-full ${prio === 'Critical' ? 'bg-red-600' : prio === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`} style={{ width: `${(count / stats.total) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
