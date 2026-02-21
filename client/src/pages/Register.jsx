import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Simplify location structure for MVP or adjust backend to accept flat structure if needed.
            // Assuming backend expects detailed location object or we just pass strings for now.
            // Let's format it to match backend expectation roughly or adjust backend later.
            // For now, sending as flat and will fix if needed, but backend User model has location: { address... }

            const payload = {
                ...formData,
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                }
            };

            const { data } = await axios.post('http://localhost:5000/api/auth/register', payload);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="text-center text-gray-600 mt-2 text-sm">Join the transparent relief network</p>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <input name="name" type="text" required className="input-field" placeholder="Full Name" onChange={handleChange} />
                    <input name="email" type="email" required className="input-field" placeholder="Email Address" onChange={handleChange} />
                    <input name="password" type="password" required className="input-field" placeholder="Password" onChange={handleChange} />
                    <input name="phone" type="text" required className="input-field" placeholder="Phone Number" onChange={handleChange} />

                    <select name="role" className="input-field" onChange={handleChange} value={formData.role}>
                        <option value="user">Affected User</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="ngo">NGO</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                        <input name="city" type="text" required className="input-field" placeholder="City" onChange={handleChange} />
                        <input name="state" type="text" required className="input-field" placeholder="State" onChange={handleChange} />
                    </div>
                    <input name="address" type="text" required className="input-field" placeholder="Address" onChange={handleChange} />
                    <input name="zip" type="text" required className="input-field" placeholder="Zip Code" onChange={handleChange} />

                    <button type="submit" className="w-full btn-primary">Register</button>
                    <div className="text-center pt-2">
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition">
                            Already have an account? Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
