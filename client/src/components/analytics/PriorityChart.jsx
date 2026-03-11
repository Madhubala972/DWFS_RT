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
                        {priorityData.map((e, i) => (
                            <Cell key={i} fill={e.name === 'Critical' ? '#dc2626' : e.name === 'High' ? '#ea580c' : '#2563eb'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default PriorityChart;
