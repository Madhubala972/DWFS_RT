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
        </div>
    );
};

export default TrackResults;
