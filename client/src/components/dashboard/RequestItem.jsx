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
        </li>
    );
};

export default RequestItem;
