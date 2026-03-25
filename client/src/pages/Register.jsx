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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!/^\d{10}$/.test(formData.phone)) {
            alert('Phone number must be exactly 10 digits');
            return;
        }
        if (formData.address.trim().length < 5) {
            alert('Please provide a valid address');
            return;
        }
        if (!/^\d{6}$/.test(formData.zip)) {
            alert('Zip code must be exactly 6 digits');
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
            alert(err.response?.data?.message || 'Registration failed'); 
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <h2 className="text-center text-3xl font-bold mb-6">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <RegisterFields 
                        formData={formData} 
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} 
                    />
                    <LocationFields 
                        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} 
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white mt-6 py-3 rounded-lg font-bold">Register</button>
                    <div className="text-center mt-4">
                        <Link to="/login" className="text-blue-600 font-semibold">Already have an account? Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
