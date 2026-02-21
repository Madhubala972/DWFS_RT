import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import UrgentNeedsModal from '../components/UrgentNeedsModal';
import DeliveryTracker from '../components/DeliveryTracker';

const Dashboard = () => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('All');
    const [deliveryProof, setDeliveryProof] = useState({}); // Map of reqId -> proof string
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            fetchRequests(storedUser);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchRequests = async (currentUser) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` },
            };
            let url = 'http://localhost:5000/api/requests/my';
            if (['admin', 'ngo', 'volunteer'].includes(currentUser.role)) {
                url = 'http://localhost:5000/api/requests';
            }
            const { data } = await axios.get(url, config);
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    const updateStatus = async (id, status, extraData = {}) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const payload = { status, ...extraData };

            // If volunteer accepting, assign to self
            if (status === 'Assigned' && user.role === 'volunteer') {
                payload.assignedTo = user._id;
            }

            await axios.put(`http://localhost:5000/api/requests/${id}`, payload, config);
            alert(`Request updated to ${status}`);
            fetchRequests(user);
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || 'Failed to update status';
            const stack = error.response?.data?.stack;
            if (stack) console.error("Server Stack:", stack);
            alert(`Error: ${msg}\n${stack ? 'Check console for stack trace' : ''}`);
        }
    };

    const handleProofChange = (id, value) => {
        setDeliveryProof({ ...deliveryProof, [id]: value });
    };

    const filteredRequests = requests.filter(req => {
        if (filter === 'All') return true;

        // Volunteer specific "My Tasks"
        if (filter === 'My Tasks' && user.role === 'volunteer') {
            return req.assignedTo?._id === user._id || req.assignedTo === user._id; // Check both populated and unpopulated
        }
        if (filter === 'Available' && user.role === 'volunteer') {
            return req.status === 'Approved' && !req.assignedTo;
        }

        return req.status === filter;
    });

    if (!user) return <div className="p-10 text-center text-gray-500">Redirecting to Login...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <UrgentNeedsModal />

            {/* Page Header */}
            <div className="bg-blue-600 text-white py-12 mb-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            User <span className="text-blue-200">Dashboard</span>
                        </h1>
                        <p className="text-blue-100 mt-2 font-medium flex items-center gap-2">
                            Welcome back, <span className="font-bold">{user.name}</span>
                            <span className="px-2 py-0.5 bg-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                {user.role}
                            </span>
                        </p>
                    </div>
                    {user.role === 'user' && (
                        <Link to="/request-help" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-50 transition">
                            + New Request
                        </Link>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12">

                {/* Role-Based Filters */}
                {['admin', 'ngo', 'volunteer'].includes(user.role) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {['All', 'Pending', 'Approved'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                {f}
                            </button>
                        ))}

                        {user.role === 'volunteer' ? (
                            <>
                                <button onClick={() => setFilter('Available')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${filter === 'Available' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                    Available
                                </button>
                                <button onClick={() => setFilter('My Tasks')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${filter === 'My Tasks' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                    My Tasks
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setFilter('Assigned')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${filter === 'Assigned' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                Assigned
                            </button>
                        )}

                        {['Delivered'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                                {f.replace(/([A-Z])/g, ' $1').trim()}
                            </button>
                        ))}
                    </div>
                )}

                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                    <ul className="divide-y divide-gray-100">
                        {filteredRequests.length === 0 ? (
                            <li className="p-20 text-center flex flex-col items-center gap-4">
                                <span className="text-5xl text-gray-200">📂</span>
                                <p className="text-gray-400 font-semibold tracking-wide">No requests found.</p>
                            </li>
                        ) : filteredRequests.map((req) => (
                            <li key={req._id} className="hover:bg-gray-50 transition-colors">
                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {req.type}
                                                </span>
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-500">{req.quantity}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs">
                                                <a href={`/track-delivery?id=${req._id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 font-semibold hover:underline">
                                                    <span>🚚</span> Live Tracking
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded text-xs font-bold ${req.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            req.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                {req.status?.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                            <span className={`px-3 py-1 rounded text-xs font-bold ${req.priority === 'Critical' ? 'bg-red-600 text-white' :
                                                    req.priority === 'High' ? 'bg-orange-500 text-white' :
                                                        req.priority === 'Medium' ? 'bg-blue-500 text-white' :
                                                            'bg-gray-500 text-white'}`}>
                                                {req.priority}
                                            </span>
                                        </div>
                                    </div>
                                    {req.priorityExplanation && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm border border-gray-100 flex items-start gap-3">
                                            <span className="text-xl">🤖</span>
                                            <div>
                                                <p className="font-bold text-gray-900 mb-0.5">AI Analysis:</p>
                                                <p className="text-gray-600">{req.priorityExplanation}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mt-4 text-gray-700 leading-relaxed">
                                        <p>{req.description}</p>
                                    </div>
                                    <div className="mt-4 text-xs text-gray-500 flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                                        <p className="flex items-center gap-1"><span>📍</span> {req.location?.address}, {req.location?.city}, {req.location?.state} {req.location?.zip}</p>
                                        <p className="bg-gray-50 px-2 py-1 rounded">Added {new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="mt-6">
                                        <DeliveryTracker status={req.status} />
                                    </div>

                                    {/* Action Buttons */}
                                    {['admin', 'ngo', 'volunteer'].includes(user.role) && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
                                            {req.status === 'Pending' && (
                                                <>
                                                    {req.priority === 'Critical' && user.role !== 'admin' ? (
                                                        <div className="text-gray-400 text-xs font-bold italic px-3 py-1 uppercase">
                                                            🔒 Admin Review Required
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => updateStatus(req._id, 'Approved')} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition">
                                                            Approve
                                                        </button>
                                                    )}
                                                    <button onClick={() => updateStatus(req._id, 'Rejected')} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition">
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {req.status === 'Approved' && (
                                                <button onClick={() => updateStatus(req._id, 'Assigned')} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                                                    Accept for Delivery
                                                </button>
                                            )}

                                            {req.status === 'Assigned' && (
                                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                                    <input
                                                        type="text"
                                                        placeholder="Delivery notes / proof link..."
                                                        className="input-field"
                                                        value={deliveryProof[req._id] || ''}
                                                        onChange={(e) => handleProofChange(req._id, e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => updateStatus(req._id, 'Delivered', { deliveryNotes: deliveryProof[req._id] })}
                                                        className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition disabled:opacity-50"
                                                        disabled={!deliveryProof[req._id]}
                                                    >
                                                        Finalize
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
