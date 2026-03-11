const ModalList = ({ requests }) => {
    if (!requests?.length) return null;
    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm max-h-48 overflow-y-auto border">
            <ul className="space-y-4">
                {requests.map((req, i) => (
                    <li key={i} className="border-b last:border-0 pb-3">
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-900">● {req.type}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${req.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{req.priority}</span>
                        </div>
                        <p className="text-gray-500 mt-1 text-xs">{req.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ModalList;
