import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import SummaryCards from '../components/analytics/SummaryCards';

import TrendsSection from '../components/analytics/TrendsSection';
import PriorityChart from '../components/analytics/PriorityChart';
import TopResources from '../components/analytics/TopResources';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [timeframe, setTimeframe] = useState('week');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || user.role !== 'admin') { navigate(user ? '/' : '/login'); return; }
            
            setLoading(true);
            try {
                // Check cache first
                const cacheKey = `stats_${timeframe}`;
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    setStats(JSON.parse(cached));
                    // Optional: Still fetch in background (SWR) but don't show loading
                }

                const { data } = await api.get(`/api/requests/stats?timeframe=${timeframe}`);
                setStats(data);
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
            } catch (e) { 
                if (e.response?.status === 401) navigate('/login'); 
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [navigate, timeframe]);

    if (!stats && loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                <p className="font-bold text-blue-600 animate-pulse">Analyzing Trends...</p>
            </div>
        </div>
    );

    const priorityData = stats ? Object.entries(stats.byPriority).map(([name, value]) => ({ name, value })) : [];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-blue-600 text-white py-12 mb-8 px-4 text-center md:text-left">
                <h1 className="text-3xl font-bold">Platform <span className="text-blue-200">Analytics</span></h1>
                <p className="text-blue-100 mt-2">Real-time governance insights and metrics.</p>
            </div>
            <div className={`max-w-7xl mx-auto px-4 space-y-8 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {loading && <div className="fixed top-24 right-8 z-50 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border shadow-lg flex items-center gap-2 text-sm font-semibold text-blue-600 animate-bounce">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    Refreshing Stats...
                </div>}
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
