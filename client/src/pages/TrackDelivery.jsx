import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import DeliveryTracker from '../components/DeliveryTracker';

const TrackDelivery = () => {
    const [searchParams] = useSearchParams();
    const [id, setId] = useState(searchParams.get('id') || '');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [userRequests, setUserRequests] = useState([]);

    const trackRequest = async (trackId) => {
        if (!trackId) return;

        // Basic validation for 24-char hex string (MongoDB ObjectID)
        if (!/^[0-9a-fA-F]{24}$/.test(trackId)) {
            setError('Please enter a valid 24-character Request ID.');
            return;
        }

        setLoading(true);
        setError(null);
        setStatus(null);

        try {
            const { data } = await axios.get(`http://localhost:5000/api/requests/track/${trackId}`);
            setStatus(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Request not found or server error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserRequests = async (currentUser) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/requests/my', config);
            setUserRequests(data);
        } catch (error) {
            console.error('Error fetching user requests', error);
        }
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchUserRequests(storedUser);
        }

        const urlId = searchParams.get('id');
        if (urlId) {
            setId(urlId);
            trackRequest(urlId);
        }
    }, [searchParams]);

    const handleTrack = (e) => {
        e.preventDefault();
        trackRequest(id);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="bg-blue-600 text-white py-12 mb-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold">
                        Track Your <span className="text-blue-200">Aid Delivery</span>
                    </h1>
                    <p className="text-blue-100 mt-3 max-w-2xl mx-auto">
                        Real-time transparency from verification to the final mile.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tracking Input & User Context */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span>🔍</span> Manual Tracking
                        </h2>
                        <form onSubmit={handleTrack} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter Request ID"
                                className="input-field"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary"
                            >
                                {loading ? 'Tracking...' : 'Track Status'}
                            </button>
                        </form>
                        {error && <p className="text-red-500 mt-4 text-sm font-bold">{error}</p>}
                    </div>

                    {!user ? (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-blue-800 font-bold mb-2">Are you a registered user?</h3>
                            <p className="text-blue-600 text-sm mb-4">
                                Log in to easily view all your registered help requests and their exact tracking details.
                            </p>
                            <Link to="/login" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                                Login to View My Requests
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-gray-900 font-bold mb-4 flex items-center justify-between">
                                My Registered Requests
                                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded font-black uppercase">
                                    {user.role}
                                </span>
                            </h3>
                            {userRequests.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">You haven't submitted any requests yet.</p>
                            ) : (
                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                    {userRequests.map((req) => (
                                        <button
                                            key={req._id}
                                            onClick={() => { setId(req._id); trackRequest(req._id); }}
                                            className={`w-full text-left p-3 rounded-lg border transition-all ${id === req._id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-sm text-gray-800">{req.type}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 line-clamp-1">{req.description}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Tracking Details */}
                <div className="lg:col-span-2">
                    {status ? (
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                            <div className="mb-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">
                                            Tracking ID: <span className="text-blue-600">#{id.slice(-6).toUpperCase()}</span>
                                        </h2>
                                        <p className="text-gray-500 text-xs mt-1">Request initiated on {new Date(status.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider
                                        ${status.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            status.status === 'Assigned' || status.status === 'InProgress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'}`}>
                                        {status.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-2">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Aid Category</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl shadow-sm">
                                                {status.type === 'Food' ? '🍱' : status.type === 'Medical' ? '⚕️' : '📦'}
                                            </div>
                                            <p className="text-lg font-bold text-gray-800">{status.type}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Quantity / Volume</p>
                                        <p className="text-lg font-bold text-gray-800">{status.quantity}</p>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Request Description</p>
                                        <p className="text-sm text-gray-600 leading-relaxed italic border-l-4 border-blue-100 pl-4">
                                            "{status.description}"
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-wider text-center">Live Delivery Lifecycle</h3>
                                    <DeliveryTracker status={status.status} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-20 rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6">🛰️</div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Awaiting Tracking Input</h2>
                            <p className="text-gray-500 text-sm max-w-sm">
                                Enter your unique 24-character Request ID or select a request from your list to see the live distribution progress.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackDelivery;
