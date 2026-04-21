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
            {isApproved && <button onClick={() => updateStatus(req._id, 'Assigned')} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">Accept for Delivery</button>}
            {isAssigned && (
                <div className="w-full space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">Delivery Notes</label>
                        <textarea 
                            placeholder="Add details about the delivery completion..." 
                            className="w-full border border-gray-200 p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none bg-gray-50/50" 
                            rows="2"
                            value={deliveryProof[req._id] || ''} 
                            onChange={(e) => onProofChange(req._id, e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => updateStatus(req._id, 'Delivered', { deliveryNotes: deliveryProof[req._id] })} 
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-base w-full transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-200 active:scale-95"
                    >
                        <span>✔</span> Finalize & Complete Delivery
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestActions;
