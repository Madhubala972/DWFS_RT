import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import HelpHeader from '../components/request/HelpHeader';
import FormFields from '../components/request/FormFields';
import FormExtra from '../components/request/FormExtra';

const RequestHelp = () => {
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
            alert('Please login to request assistance');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (formData.location.trim().length < 5) {
            setError('Please provide a valid address');
            setLoading(false);
            return;
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
            setError('Pincode must be exactly 6 digits');
            setLoading(false);
            return;
        }

        try {
            await api.post('/api/requests', formData);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) { 
            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }, 2000);
            } else {
                setError(err.response?.data?.message || 'Error occurred'); 
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <HelpHeader />
            <div className="max-w-3xl mx-auto px-4">
                {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center font-medium animate-shake border border-red-200">{error}</div>}
                {success && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl text-center font-medium animate-pulse border border-green-200">Request submitted successfully! Redirecting...</div>}
                
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border">
                    <FormFields formData={formData} handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                    <FormExtra formData={formData} setFormData={setFormData} />
                    <button 
                        type="submit" 
                        disabled={loading || success} 
                        className={`w-full text-white mt-8 py-4 rounded-xl font-bold transition-all transform active:scale-95 ${loading || success ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Submitting Request...
                            </span>
                        ) : success ? "Success!" : "Submit Request"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestHelp;
