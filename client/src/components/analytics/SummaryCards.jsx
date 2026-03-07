import React from 'react';

const SummaryCards = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md border-l-4 border-l-blue-400">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Requests</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md border-l-4 border-l-red-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Critical Cases</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.byPriority['Critical'] || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md border-l-4 border-l-green-500">
                <div className="flex justify-between items-start">
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Delivered</h3>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">PROBITY</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.byStatus['Delivered'] || 0}</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-bold text-green-600 flex items-center">
                        {stats.lastWeekDeliveries || 0}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">in last 7 days</span>
                    {stats.previousWeekDeliveries > 0 && (
                        <span className={`text-[10px] font-bold ${stats.lastWeekDeliveries >= stats.previousWeekDeliveries ? 'text-green-500' : 'text-red-500'}`}>
                            {stats.lastWeekDeliveries >= stats.previousWeekDeliveries ? '↑' : '↓'}
                            {Math.abs(Math.round(((stats.lastWeekDeliveries - stats.previousWeekDeliveries) / stats.previousWeekDeliveries) * 100))}%
                        </span>
                    )}
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md border-l-4 border-l-blue-500">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Pending</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.byStatus['Pending'] || 0}</p>
                <div className="mt-2 text-[10px] text-gray-400 font-medium italic">Awaiting AI/Admin response</div>
            </div>
        </div>
    );
};

export default SummaryCards;
