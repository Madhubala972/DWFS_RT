import TrendChart from './TrendChart';

const TrendsSection = ({ timeframe, setTimeframe, timelineData }) => {
    const velocityLines = [{ key: 'requests', name: 'Incoming', color: '#ef4444' }, { key: 'delivery', name: 'Completed', color: '#2563eb' }];
    const categoryLines = [{ key: 'Food', color: '#2563eb' }, { key: 'Medical', color: '#10b981' }, { key: 'Funds', color: '#f59e0b' }, { key: 'Clothes', color: '#8b5cf6' }, { key: 'Essentials', color: '#ec4899' }];

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h2 className="text-2xl font-bold">Statistical Trends</h2>
                <div className="flex gap-1 border p-1 rounded-lg">
                    {['day', 'week', 'month', 'year', 'all'].map(t => (
                        <button key={t} onClick={() => setTimeframe(t)} className={`px-4 py-2 text-sm rounded-md transition ${timeframe === t ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <TrendChart data={timelineData} lines={velocityLines} timeframe={timeframe} title="Distribution Velocity" color="blue" />
                <TrendChart data={timelineData} lines={categoryLines} timeframe={timeframe} title="Demand Trends" color="green" />
            </div>
        </div>
    );
};

export default TrendsSection;
