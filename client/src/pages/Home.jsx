import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-light">
            {/* Hero Section */}
            <div className="bg-primary text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Connecting Help to Those in Need
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                        A transparent platform ensuring disaster relief reaches the right people efficiently and accountably.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/request-help" className="bg-white text-primary px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition shadow-lg">
                            Get Help Now
                        </Link>
                        <Link to="/register" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-white hover:text-primary transition">
                            Volunteer / Donate
                        </Link>
                    </div>
                </div>
            </div>

            {/* Emergency Contact Bar */}
            <div className="bg-red-600 text-white py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-lg font-bold flex items-center mb-2 md:mb-0">
                        <span className="text-2xl mr-2">🚨</span> Emergency Helpline: 108 / 112
                    </div>
                    <div className="flex space-x-6">
                        <a href="tel:108" className="hover:underline">Ambulance: 108</a>
                        <a href="tel:100" className="hover:underline">Police: 100</a>
                        <a href="tel:101" className="hover:underline">Fire: 101</a>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">About the Platform</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We bridge the gap between disaster victims, relief agencies, and volunteers. Our AI-driven system prioritizes requests based on urgency, ensuring that help reaches the most critical cases first. Transparency is at our core, with real-time tracking from request to delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card text-center hover:shadow-xl transition-shadow bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-secondary text-5xl mb-4">🛡️</div>
                        <h3 className="text-xl font-bold mb-2">Verified Requests</h3>
                        <p className="text-gray-600">Every request is verified by administrators to prevent fraud and ensure fair distribution.</p>
                    </div>
                    <div className="card text-center hover:shadow-xl transition-shadow bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-accent text-5xl mb-4">🚚</div>
                        <h3 className="text-xl font-bold mb-2">Track Delivery</h3>
                        <p className="text-gray-600">Real-time tracking of aid from dispatch to delivery with proof of completion.</p>
                    </div>
                    <div className="card text-center hover:shadow-xl transition-shadow bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="text-primary text-5xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold mb-2">AI Prioritization</h3>
                        <p className="text-gray-600">Smart algorithms prioritize critical needs to ensure urgent cases are handled first.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
