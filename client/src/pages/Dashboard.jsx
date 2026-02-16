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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <UrgentNeedsModal />
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user.name} ({user.role.toUpperCase()})</p>
                </div>
                {user.role === 'user' && (
                    <Link to="/request-help" className="mt-4 md:mt-0 btn-primary">
                        + New Request
                    </Link>
                )}
            </div>

            {/* Role-Based Filters */}
            {['admin', 'ngo', 'volunteer'].includes(user.role) && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {['All', 'Pending', 'Approved'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === f ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {f}
                        </button>
                    ))}

                    {user.role === 'volunteer' ? (
                        <>
                            <button onClick={() => setFilter('Available')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'Available' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                Available
                            </button>
                            <button onClick={() => setFilter('My Tasks')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'My Tasks' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                My Tasks
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setFilter('Assigned')} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === 'Assigned' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            Assigned
                        </button>
                    )}

                    {['Delivered'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium ${filter === f ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                            {f.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <ul className="divide-y divide-gray-200">
                    {filteredRequests.length === 0 ? (
                        <li className="p-8 text-center text-gray-500">No requests found in this category.</li>
                    ) : filteredRequests.map((req) => (
                        <li key={req._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-lg font-medium text-primary cursor-pointer hover:underline">
                                                {req.type}
                                            </span>
                                            <span className="text-sm text-gray-500">- {req.quantity}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                                            <a href={`/track-delivery?id=${req._id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:text-blue-700 underline">
                                                🚚 Track
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                            ${req.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                req.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                                                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        req.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                                                            req.status === 'InProgress' ? 'bg-orange-100 text-orange-800' :
                                                                req.status === 'Collected' ? 'bg-teal-100 text-teal-800' :
                                                                    'bg-gray-100 text-gray-800'}`}>
                                            {req.status?.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${req.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                                req.priority === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                    req.priority === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-green-50 text-green-700 border-green-200'
                                            }`}>
                                            {req.priority} ({req.priorityScore || 0})
                                        </span>
                                    </div>
                                </div>
                                {req.priorityExplanation && (
                                    <div className="mt-3 p-3 bg-blue-50/50 rounded-xl text-xs border border-blue-100 flex items-start gap-2">
                                        <span className="text-lg">🤖</span>
                                        <div>
                                            <p className="font-bold text-blue-800">AI Priority Analysis:</p>
                                            <p className="text-blue-700 italic">{req.priorityExplanation}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>{req.description}</p>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 flex flex-col sm:flex-row sm:justify-between">
                                    <p>📍 {req.location?.address}, {req.location?.city}, {req.location?.state} {req.location?.zip}</p>
                                    <p className="mt-1 sm:mt-0">📅 {new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="mt-4">
                                    <DeliveryTracker status={req.status} />
                                </div>

                                {/* Action Buttons */}
                                {['admin', 'ngo', 'volunteer'].includes(user.role) && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                        {/* Verification for Admin/NGO */}
                                        {req.status === 'Pending' && ['admin', 'ngo', 'volunteer'].includes(user.role) && (
                                            <>
                                                {req.priority === 'Critical' && user.role !== 'admin' ? (
                                                    <button disabled className="bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-xs px-3 py-1 rounded flex items-center gap-1">
                                                        🔒 Critical (Admin Only)
                                                    </button>
                                                ) : (
                                                    <button onClick={() => updateStatus(req._id, 'Approved')} className="btn-secondary text-xs px-3 py-1">
                                                        ✅ Approve
                                                    </button>
                                                )}
                                                <button onClick={() => updateStatus(req._id, 'Rejected')} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs px-3 py-1 rounded">
                                                    ❌ Reject
                                                </button>
                                            </>
                                        )}

                                        {/* Volunteer Actions */}
                                        {req.status === 'Approved' && (
                                            <button onClick={() => updateStatus(req._id, 'Assigned')} className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs px-3 py-1 rounded shadow-sm">
                                                🤚 Accept Request
                                            </button>
                                        )}

                                        {req.status === 'Assigned' && (user.role === 'volunteer' || user.role === 'ngo' || user.role === 'admin') && (
                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                                <input
                                                    type="text"
                                                    placeholder="Proof URL / Notes"
                                                    className="border border-gray-300 rounded px-2 py-1 text-xs flex-grow"
                                                    value={deliveryProof[req._id] || ''}
                                                    onChange={(e) => handleProofChange(req._id, e.target.value)}
                                                />
                                                <button
                                                    onClick={() => updateStatus(req._id, 'Delivered', { deliveryNotes: deliveryProof[req._id] })}
                                                    className="bg-green-600 text-white hover:bg-green-700 text-xs px-3 py-1 rounded shadow-sm"
                                                    disabled={!deliveryProof[req._id]}
                                                >
                                                    ✅ Mark Delivered
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
    );
};

export default Dashboard;
