const RequestActions = ({ req, user, updateStatus, deliveryProof, onProofChange }) => {
    if (!['admin', 'ngo', 'volunteer'].includes(user.role)) return null;

    const isPending = req.status === 'Pending';
    const isApproved = req.status === 'Approved';
    const isAssigned = req.status === 'Assigned';
    const isAdminReview = req.priority === 'Critical' && user.role !== 'admin';

    return (
        <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
            {isPending && (
                isAdminReview ? (
                    <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2">
                        <span className="text-red-600 text-xs font-bold uppercase tracking-wider">🔒 Admin Review Mandatory</span>
                        <span className="text-red-400 text-[10px] italic">(Priority: Critical)</span>
                    </div>
                ) : (
                    <>
                        <button onClick={() => updateStatus(req._id, 'Approved')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors">Approve</button>
                        <button onClick={() => updateStatus(req._id, 'Rejected')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors">Reject</button>
                    </>
                )
            )}
            {isApproved && <button onClick={() => updateStatus(req._id, 'Assigned')} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold text-sm">Accept for Delivery</button>}
            {isAssigned && (
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <input type="text" placeholder="Delivery notes..." className="border p-2 rounded-lg flex-1" value={deliveryProof[req._id] || ''} onChange={(e) => onProofChange(req._id, e.target.value)} />
                    <button onClick={() => updateStatus(req._id, 'Delivered', { deliveryNotes: deliveryProof[req._id] })} className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold text-sm disabled:opacity-50" disabled={!deliveryProof[req._id]}>Finalize</button>
                </div>
            )}
        </div>
    );
};

export default RequestActions;
