import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import DeliveryTracker from '../components/DeliveryTracker';

const TrackDelivery = () => {
    const [searchParams] = useSearchParams();
    const [id, setId] = useState(searchParams.get('id') || '');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    useEffect(() => {
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Track Your Aid Delivery</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Enter Request ID (e.g., 65c...)"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Tracking...' : 'Track Status'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>

            {status && (
                <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Request Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><span className="font-medium text-gray-500">Type:</span> {status.type}</p>
                            <p><span className="font-medium text-gray-500">Quantity:</span> {status.quantity}</p>
                            <p><span className="font-medium text-gray-500">Submitted:</span> {new Date(status.createdAt).toLocaleDateString()}</p>
                            <p><span className="font-medium text-gray-500">Current Status:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium 
                                    ${status.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        status.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {status.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Delivery Progress</h3>
                        <DeliveryTracker status={status.status} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackDelivery;
