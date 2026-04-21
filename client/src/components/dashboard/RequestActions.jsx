const RequestActions = ({ req, user, updateStatus, deliveryProof, onProofChange, deliveryImage, onImageChange }) => {
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
                <div className="flex flex-col gap-4 w-full bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Delivery Notes</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Handed over to recipient..." 
                                className="w-full border-blue-200 border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={deliveryProof[req._id] || ''} 
                                onChange={(e) => onProofChange(req._id, e.target.value)} 
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Proof of Delivery (Photo)</label>
                            <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 bg-white border border-blue-200 border-dashed p-2 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                                    <span className="text-sm text-blue-600 font-medium">{deliveryImage ? deliveryImage.name : 'Choose Image'}</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => onImageChange(req._id, e.target.files[0])} 
                                    />
                                </label>
                                {deliveryImage && (
                                    <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                                        <img src={URL.createObjectURL(deliveryImage)} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => updateStatus(req._id, 'Delivered', { deliveryNotes: deliveryProof[req._id], deliveryImage })} 
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50" 
                        disabled={!deliveryProof[req._id] || !deliveryImage}
                    >
                        <span>✓</span> Finalize & Complete Delivery
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestActions;
