import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const PriorityChart = ({ priorityData }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
        <h2 className="text-xl font-bold mb-6">Priority Volume Analysis</h2>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32}>
                        {priorityData.map((e, i) => {
                            const colors = {
                                'Critical': '#dc2626', // Red
                                'High': '#ea580c',     // Orange
                                'Medium': '#2563eb',   // Blue
                                'Low': '#94a3b8'       // Slate
                            };
                            return <Cell key={i} fill={colors[e.name] || '#3b82f6'} />;
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default PriorityChart;
