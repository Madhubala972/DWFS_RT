import { Link } from 'react-router-dom';

const DashboardHeader = ({ user }) => (
    <div className="bg-blue-600 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h1 className="text-3xl font-bold">User <span className="text-blue-200">Dashboard</span></h1>
                <p className="text-blue-100 mt-2 font-medium flex items-center gap-2">
                    Welcome back, <span className="font-bold">{user.name}</span>
                    <span className="px-2 py-0.5 bg-blue-700 rounded text-[10px] font-bold uppercase">{user.role}</span>
                </p>
            </div>
            {user.role === 'user' && (
                <Link to="/request-help" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-50 transition">+ New Request</Link>
            )}
        </div>
    </div>
);

export default DashboardHeader;
