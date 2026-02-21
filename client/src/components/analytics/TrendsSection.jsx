import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrendsSection = ({ timeframe, setTimeframe, timelineData }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-sm mb-12 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Statistical Trends</h2>
                    <p className="text-gray-500">
                        {timeframe === 'day' ? 'Real-time velocity (24h)' :
                            timeframe === 'month' ? 'Historical activity (30d)' :
                                timeframe === 'year' ? 'Annual distribution cycle' :
                                    timeframe === 'all' ? 'Full project history' :
                                        'Weekly distribution cycle'}
                    </p>
                </div>
                <div className="inline-flex rounded-lg border border-gray-200 p-1" role="group">
                    {['day', 'week', 'month', 'year', 'all'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all capitalize ${timeframe === t ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Distribution Velocity */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                        Distribution Velocity
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickFormatter={(date) => {
                                        if (timeframe === 'year') return new Date(date + '-01').toLocaleDateString([], { month: 'short' });
                                        const d = new Date(date.replace(' ', 'T'));
                                        return timeframe === 'day' ? d.toLocaleTimeString([], { hour: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                    }}
                                />
                                <YAxis stroke="#64748b" fontSize={10} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="requests" name="Incoming" stroke="#ef4444" strokeWidth={3} dot={false} />
                                <Line type="monotone" dataKey="delivery" name="Completed" stroke="#2563eb" strokeWidth={3} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Demand Trends by Category */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-green-600 rounded-full"></span>
                        Demand Trends by Category
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickFormatter={(date) => {
                                        if (timeframe === 'year') return new Date(date + '-01').toLocaleDateString([], { month: 'short' });
                                        const d = new Date(date.replace(' ', 'T'));
                                        return timeframe === 'day' ? d.toLocaleTimeString([], { hour: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                    }}
                                />
                                <YAxis stroke="#64748b" fontSize={10} />
                                <Tooltip />
                                <Legend iconType="circle" />
                                <Line type="monotone" dataKey="Food" stroke="#2563eb" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Medical" stroke="#10b981" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Funds" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Clothes" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="Essentials" stroke="#ec4899" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendsSection;
