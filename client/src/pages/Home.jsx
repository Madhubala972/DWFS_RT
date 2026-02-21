import { Link } from 'react-router-dom';
import UrgentNeedsModal from '../components/UrgentNeedsModal';

const Home = () => {
    return (
        <div className="min-h-screen bg-light">
            <UrgentNeedsModal />
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                        Connecting Help to <span className="text-blue-200">Those in Need</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-blue-100">
                        A transparent, AI-driven platform ensuring disaster relief reaches the right people with speed and accountability.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/request-help" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition">
                            Get Help Now
                        </Link>
                        <Link to="/register" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition">
                            Volunteer / Donate
                        </Link>
                    </div>
                </div>
            </div>

            {/* Emergency Contact Bar */}
            <div className="bg-red-600 text-white py-4 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center">
                    <div className="text-xl font-bold mb-2 md:mb-0">
                        🚨 EMERGENCY HELPLINE: 108 / 112
                    </div>
                    <div className="flex space-x-6 font-semibold">
                        <a href="tel:108" className="hover:underline">Ambulance: 108</a>
                        <a href="tel:100" className="hover:underline">Police: 100</a>
                        <a href="tel:101" className="hover:underline">Fire: 101</a>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        About the Platform
                    </h2>
                    <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                        We bridge the gap between disaster victims, relief agencies, and volunteers. Our AI-driven system prioritizes requests based on urgency, ensuring that help reaches the most critical cases first. Transparency is at our core, with real-time tracking from request to delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link to="/dashboard" className="card group">
                        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors text-3xl">
                            🛡️
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Verified Requests</h3>
                        <p className="text-gray-600">Every request is verified by administrators to prevent fraud and ensure fair distribution.</p>
                    </Link>
                    <Link to="/track-delivery" className="card group">
                        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-100 transition-colors text-3xl">
                            🚚
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">Track Delivery</h3>
                        <p className="text-gray-600">Real-time tracking of aid from dispatch to delivery with proof of completion.</p>
                    </Link>
                    <Link to="/analytics" className="card group">
                        <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-100 transition-colors text-3xl">
                            🎯
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">AI Prioritization</h3>
                        <p className="text-gray-600">Smart algorithms prioritize critical needs to ensure urgent cases are handled first.</p>
                    </Link>
                </div>
                <div className="text-center mt-12">
                    <Link to="/analytics" className="btn-primary">
                        View Real-time Analytics
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
