import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrendChart = ({ data, lines, timeframe, title, color }) => (
    <div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className={`w-2 h-6 rounded-full bg-${color}-600`}></span>
            {title}
        </h3>
        <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Legend iconType="circle" />
                    {lines.map(line => <Line key={line.key} type="monotone" dataKey={line.key} name={line.name} stroke={line.color} strokeWidth={2} dot={false} />)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export default TrendChart;
