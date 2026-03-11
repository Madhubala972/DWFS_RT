import { useNavigate, Link } from 'react-router-dom';
import AIHeader from '../components/ai/AIHeader';
import AIGovernance from '../components/ai/AIGovernance';

const AIPrioritization = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-xl border border-red-200">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <Link to="/" className="text-blue-600 underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <AIHeader />
            <div className="max-w-7xl mx-auto px-4">
                <div className="p-8 bg-white border rounded-xl shadow-sm italic text-gray-500 text-center">
                    AI performance metrics currently scaling for regional deployment.
                </div>
                <AIGovernance />
            </div>
        </div>
    );
};

export default AIPrioritization;
