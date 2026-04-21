import DeliveryTracker from '../DeliveryTracker';

const RequestItem = ({ req, user, updateStatus, deliveryProof, onProofChange }) => {
    const priorityColors = {
        'Critical': 'border-l-red-600',
        'High': 'border-l-indigo-600',
        'Medium': 'border-l-blue-500',
        'Low': 'border-l-green-500'
    };

    return (
        <li className={`hover:bg-gray-50 transition-colors p-6 border-l-4 ${priorityColors[req.priority] || 'border-l-gray-300'}`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-3">
                        <span className="text-xl font-bold text-gray-900">{req.type}</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-500">{req.quantity}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <a href={`/track-delivery?id=${req._id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline tracking-tight">🚚 Live Tracking</a>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className={`px-2 py-1 rounded ${req.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{req.status}</span>
                    <span className={`px-2 py-1 rounded ${req.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}`}>{req.priority}</span>
                </div>
            </div>
            <p className="mt-4 text-gray-700 text-sm">{req.description}</p>
            <div className="mt-4 text-xs text-gray-500 flex justify-between">
                <p>📍 {typeof req.location === 'object' ? req.location.address : req.location}, {req.city || req.location?.city} - {req.pincode || req.location?.zip}</p>
                <p className="bg-gray-50 px-2 py-1 rounded">Added {new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-6"><DeliveryTracker status={req.status} /></div>
            
            {req.status === 'Delivered' && req.proofOfDelivery && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                    <h4 className="text-xs font-bold text-green-700 uppercase mb-2">📦 Proof of Delivery</h4>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="w-32 h-32 rounded-lg bg-gray-200 overflow-hidden shadow-sm flex-shrink-0 border border-green-200">
                            <img 
                                src={(import.meta.env.VITE_API_URL || 'http://localhost:5000') + req.proofOfDelivery} 
                                alt="Proof of Delivery" 
                                className="w-full h-full object-cover cursor-zoom-in"
                                onClick={() => window.open((import.meta.env.VITE_API_URL || 'http://localhost:5000') + req.proofOfDelivery, '_blank')}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-green-800 italic">"{req.deliveryNotes || 'No delivery notes provided.'}"</p>
                            <p className="mt-2 text-[10px] font-bold text-green-600 uppercase">Delivered on {new Date(req.deliveredAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default RequestItem;
