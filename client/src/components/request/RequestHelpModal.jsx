import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import FormFields from './FormFields';
import FormExtra from './FormExtra';

const RequestHelpModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        type: 'Food',
        description: '',
        quantity: '',
        city: '',
        location: '',
        pincode: '',
        vulnerability: { elderly: false, disabled: false },
        locationRisk: 'Normal'
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = !!(user && user.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isLoggedIn) {
            setError('Please login to submit a request.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        setLoading(true);
        setError(null);

        if (formData.location.trim().length < 5) {
            setError('Valid address required');
            setLoading(false);
            return;
        }

        try {
            await api.post('/api/requests', formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    type: 'Food',
                    description: '',
                    quantity: '',
                    city: '',
                    location: '',
                    pincode: '',
                    vulnerability: { elderly: false, disabled: false },
                    locationRisk: 'Normal'
                });
            }, 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed');
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 30 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="bg-white w-full max-w-2xl rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] overflow-hidden relative border border-white/20"
                    >
                        <button onClick={onClose} className="absolute top-6 right-6 text-white/90 hover:text-white transition-all transform hover:rotate-90 z-10 p-2 bg-black/10 rounded-full">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 text-white text-center">
                            <h2 className="text-4xl font-extrabold tracking-tight">Request Assistance</h2>
                            <p className="text-blue-100 mt-3 text-lg opacity-90 max-w-md mx-auto">Connect directly with local disaster relief teams and tracking.</p>
                        </div>

                        <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {!isLoggedIn ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-6">🔒</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto text-lg leading-relaxed">
                                        To ensure aid reaches those in need, please log in to your account before submitting a request.
                                    </p>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl transition-all transform hover:scale-105 active:scale-95"
                                    >
                                        Go to Login
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {error && <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-center font-medium border border-red-100 animate-shake">{error}</div>}
                                    {success && <div className="mb-8 p-6 bg-green-50 text-green-600 rounded-2xl text-center font-bold border border-green-100 animate-pulse text-lg">✔ Request submitted successfully!</div>}
                                    
                                    {!success && (
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            <FormFields formData={formData} handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                                            <FormExtra formData={formData} setFormData={setFormData} />
                                            <button 
                                                type="submit" 
                                                disabled={loading} 
                                                className={`w-full text-white py-5 rounded-2xl font-black text-xl tracking-wide uppercase transition-all transform active:scale-95 shadow-2xl ${loading ? 'bg-blue-400 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'}`}
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-3">
                                                        <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                        Processing...
                                                    </span>
                                                ) : "Submit Urgent Request"}
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RequestHelpModal;
