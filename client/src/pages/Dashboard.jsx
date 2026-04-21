import { useState, useMemo } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardFilters from '../components/dashboard/DashboardFilters';
import RequestItem from '../components/dashboard/RequestItem';
import RequestActions from '../components/dashboard/RequestActions';
import UrgentNeedsModal from '../components/UrgentNeedsModal';

const Dashboard = () => {
    const { requests, user, updateStatus } = useDashboard();
    const [filter, setFilter] = useState('All');
    const [deliveryProof, setDeliveryProof] = useState({});
    const [deliveryImages, setDeliveryImages] = useState({});

    const filtered = useMemo(() => requests.filter(req => {
        if (filter === 'All') return true;
        if (filter === 'My Tasks') return req.assignedTo?._id === user?._id || req.assignedTo === user?._id;
        if (filter === 'Available') return req.status === 'Approved' && !req.assignedTo;
        return req.status === filter;
    }), [requests, filter, user]);

    if (!user) return <div className="p-10 text-center">Redirecting...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <UrgentNeedsModal />
            <DashboardHeader user={user} />
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <DashboardFilters user={user} filter={filter} setFilter={setFilter} />
                <div className="bg-white shadow rounded-xl overflow-hidden border">
                    {filtered.length === 0 ? <div className="p-20 text-center">No requests found.</div> : (
                        <ul className="divide-y">
                            {filtered.map(req => (
                                <div key={req._id}>
                                    <RequestItem req={req} user={user} updateStatus={updateStatus} deliveryProof={deliveryProof} onProofChange={(id, v) => setDeliveryProof({ ...deliveryProof, [id]: v })} />
                                    <RequestActions 
                                        req={req} 
                                        user={user} 
                                        updateStatus={updateStatus} 
                                        deliveryProof={deliveryProof} 
                                        onProofChange={(id, v) => setDeliveryProof({ ...deliveryProof, [id]: v })}
                                        deliveryImage={deliveryImages[req._id]}
                                        onImageChange={(id, v) => setDeliveryImages({ ...deliveryImages, [id]: v })} 
                                    />
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
