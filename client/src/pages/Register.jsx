import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import RegisterFields from '../components/auth/RegisterFields';
import LocationFields from '../components/auth/LocationFields';

const Register = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'user', 
        phone: '', 
        address: '', 
        city: '', 
        state: '', 
        zip: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Phone number must be exactly 10 digits');
            setLoading(false);
            return;
        }
        if (formData.address.trim().length < 5) {
            setError('Please provide a valid address');
            setLoading(false);
            return;
        }
        if (!/^\d{6}$/.test(formData.zip)) {
            setError('Zip code must be exactly 6 digits');
            setLoading(false);
            return;
        }

        try {
            const loc = { 
                address: formData.address, 
                city: formData.city, 
                state: formData.state, 
                zip: formData.zip 
            };
            const { data } = await api.post('/api/auth/register', { ...formData, location: loc });
            localStorage.setItem('user', JSON.stringify(data)); 
            navigate('/dashboard');
        } catch (err) { 
            setError(err.response?.data?.message || 'Registration failed'); 
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Create Account</h2>
                {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium animate-shake">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <RegisterFields 
                        formData={formData} 
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} 
                    />
                    <LocationFields 
                        formData={formData}
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} 
                    />
                    <button type="submit" disabled={loading} className={`w-full text-white mt-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Creating Account...
                            </span>
                        ) : "Register"}
                    </button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-blue-600 font-semibold hover:underline">Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
