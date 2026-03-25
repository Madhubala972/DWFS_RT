import { useState, useEffect } from 'react';
import api from '../services/api';
import { useSearchParams, Link } from 'react-router-dom';
import TrackHeader from '../components/track/TrackHeader';
import TrackInput from '../components/track/TrackInput';
import TrackResults from '../components/track/TrackResults';

const TrackDelivery = () => {
    const [searchParams] = useSearchParams();
    const [searchId, setSearchId] = useState(searchParams.get('id') || '');
    const [request, setRequest] = useState(null);
    const [userRequests, setUserRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    const trackRequest = async (id) => {
        if (!id) return;
        setLoading(true); setRequest(null);
        try {
            const { data } = await api.get(`/api/requests/track/${id}`);
            setRequest(data);
        } catch (e) { alert('No request found with this ID'); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (searchId) trackRequest(searchId);

        if (user) {
            const fetchMyRequests = async () => {
                try {
                    const { data } = await api.get('/api/requests/my');
                    setUserRequests(data);
                } catch (e) { console.error('Error fetching user requests:', e); }
            };
            fetchMyRequests();
        }
    }, [searchId]);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <TrackHeader />
            <div className="max-w-3xl mx-auto px-4">
                <TrackInput searchId={searchId} setSearchId={setSearchId} handleTrack={(e) => { e.preventDefault(); trackRequest(searchId); }} loading={loading} />
                <TrackResults request={request} />

                <div className="mt-12">
                    {user ? (
                        <>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">Your Recent Requests</h3>
                            {userRequests.length > 0 ? (
                                <div className="grid gap-4">
                                    {userRequests.map((req) => (
                                        <div
                                            key={req._id}
                                            onClick={() => { setSearchId(req._id); trackRequest(req._id); }}
                                            className="bg-white p-4 rounded-lg border hover:border-blue-500 cursor-pointer transition-all flex justify-between items-center shadow-sm"
                                        >
                                            <div>
                                                <p className="font-bold text-gray-900">{req.type}</p>
                                                <p className="text-xs text-gray-500">ID: {req._id}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${req.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {req.status}
                                                </span>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">You haven't made any requests yet.</p>
                            )}
                        </>
                    ) : (
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                            <p className="text-blue-800 font-semibold mb-3">Don't know your Request ID?</p>
                            <Link to="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                                Login to see your requests
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackDelivery;
