import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import SummaryCards from '../components/analytics/SummaryCards';

import TrendsSection from '../components/analytics/TrendsSection';
import PriorityChart from '../components/analytics/PriorityChart';
import TopResources from '../components/analytics/TopResources';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [timeframe, setTimeframe] = useState('week');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || user.role !== 'admin') { navigate(user ? '/' : '/login'); return; }
            try {
                const { data } = await api.get(`/requests/stats?timeframe=${timeframe}`);
                setStats(data);
            } catch (e) { if (e.response?.status === 401) navigate('/login'); }
        };
        fetchStats();
    }, [navigate, timeframe]);

    if (!stats) return <div className="p-10 text-center">Loading...</div>;

    const priorityData = Object.entries(stats.byPriority).map(([name, value]) => ({ name, value }));

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-blue-600 text-white py-12 mb-8 px-4 text-center md:text-left">
                <h1 className="text-3xl font-bold">Platform <span className="text-blue-200">Analytics</span></h1>
                <p className="text-blue-100 mt-2">Real-time governance insights and metrics.</p>
            </div>
            <div className="max-w-7xl mx-auto px-4 space-y-8">
                <SummaryCards stats={stats} />

                <TrendsSection timeframe={timeframe} setTimeframe={setTimeframe} timelineData={stats.timeline} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <PriorityChart priorityData={priorityData} />
                    </div>
                    <TopResources stats={stats} />
                </div>
            </div>
        </div>
    );
};

export default Analytics;
