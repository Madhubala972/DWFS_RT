import DeliveryTracker from '../DeliveryTracker';

const TrackResults = ({ request }) => {
    if (!request) return null;
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border">
            <h2 className="text-2xl font-bold mb-4">{request.type}</h2>
            <div className="flex gap-4 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-bold uppercase">{request.status}</span>
                <span className="text-gray-500 text-sm italic">ID: {request._id}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2 font-semibold">📍 {typeof request.location === 'object' ? request.location.address : request.location}, {request.city || request.location?.city} - {request.pincode || request.location?.zip}</p>
            <p className="text-gray-600 mb-8">{request.description}</p>
            <DeliveryTracker status={request.status} />
            
            {request.status === 'Delivered' && request.proofOfDelivery && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase mb-4 tracking-wider flex items-center gap-2">
                        <span>📦</span> Proof of Delivery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div 
                            className="aspect-square rounded-xl overflow-hidden border shadow-inner bg-gray-50 cursor-pointer group"
                            onClick={() => window.open((import.meta.env.VITE_API_URL || 'http://localhost:5000') + request.proofOfDelivery, '_blank')}
                        >
                            <img 
                                src={(import.meta.env.VITE_API_URL || 'http://localhost:5000') + request.proofOfDelivery} 
                                alt="Proof of Delivery" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        <div className="space-y-3">
                            <p className="text-gray-700 leading-relaxed italic border-l-4 border-green-500 pl-4 bg-green-50/50 py-2">
                                {request.deliveryNotes || 'No delivery notes provided.'}
                            </p>
                            <div className="text-xs text-gray-500 font-medium">
                                <p>Delivered on: <span className="text-gray-900">{new Date(request.deliveredAt).toLocaleString()}</span></p>
                                <p>Location: <span className="text-gray-900">{request.city}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackResults;
