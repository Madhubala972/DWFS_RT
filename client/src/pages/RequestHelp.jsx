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

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.token) {
            alert('Please login to request assistance');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (formData.location.trim().length < 5) {
            alert('Please provide a valid address');
            return;
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
            alert('Pincode must be exactly 6 digits');
            return;
        }

        try {
            await api.post('/api/requests', formData);
            alert('Request submitted successfully!');
            navigate('/dashboard');
        } catch (err) { 
            if (err.response?.status === 401) {
                alert('Session expired or invalid. Please login again.');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                alert(err.response?.data?.message || 'Error occurred'); 
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <HelpHeader />
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border">
                <FormFields formData={formData} handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} />
                <FormExtra formData={formData} setFormData={setFormData} />
                <button type="submit" className="w-full bg-blue-600 text-white mt-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Submit Request</button>
            </form>
        </div>
    );
};

export default RequestHelp;
