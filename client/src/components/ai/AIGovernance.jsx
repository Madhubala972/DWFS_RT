import { Link } from 'react-router-dom';

const AIGovernance = () => (
    <div className="mt-12 p-8 bg-white border rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">AI Governance & Scalability</h3>
            <p className="text-gray-600 text-sm italic">
                Our architecture ensures transparency with full audit trails.
            </p>
        </div>
        <Link to="/audit-logs" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md">
            View Audit Logs
        </Link>
    </div>
);

export default AIGovernance;
