import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ModalHeader from './modal/ModalHeader';
import ModalList from './modal/ModalList';
import ModalActions from './modal/ModalActions';

const UrgentNeedsModal = () => {
    const [stats, setStats] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/api/requests/summary');
                if (data.byStatus?.Pending > 0) {
                    setStats(data);
                    setTimeout(() => setIsVisible(true), 1500);
                }
            } catch (e) { console.error(e); }
        };
        fetchStats();
    }, [user?.role]);

    if (!isVisible || !stats) return null;

    const role = user?.role || 'guest';
    const pending = stats.byStatus?.Pending || 0;
    const title = role === 'admin' ? 'Action Required' : (role === 'volunteer' ? 'New Tasks Available' : 'Urgent Help Needed!');
    const msg = role === 'admin' ? `Review ${pending} pending requests.` : `Join to help ${pending} people in need.`;

    const handleNav = () => {
        setIsVisible(false);
        if (location.pathname !== '/dashboard') navigate('/dashboard');
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden border">
                    <ModalHeader title={title} role={role} onClose={() => setIsVisible(false)} />
                    <div className="p-6">
                        <p className="text-gray-700 mb-6 text-sm italic">{msg}</p>
                        <ModalList requests={stats.urgentRequests} />
                        <div className="flex flex-col gap-3">
                            <ModalActions role={role} onNavigate={handleNav} onClose={() => setIsVisible(false)} />
                            <button onClick={() => setIsVisible(false)} className="text-gray-400 text-[10px] font-bold uppercase">Dismiss</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UrgentNeedsModal;
