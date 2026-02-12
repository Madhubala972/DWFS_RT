import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestHelp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: 'Food',
        description: '',
        quantity: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        proofOfNeed: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login first');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const payload = {
                type: formData.type,
                description: formData.description,
                quantity: formData.quantity,
                proofOfNeed: formData.proofOfNeed,
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                }
            };

            const res = await axios.post('http://localhost:5000/api/requests', payload, config);
            alert(`Request submitted successfully! Priority assigned: ${res.data.priority}`);
            navigate('/dashboard');
        } catch (error) {
            alert('Error submitting request');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Request Help</h1>
            <div className="card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type of Assistance</label>
                        <select name="type" className="input-field mt-1" value={formData.type} onChange={handleChange}>
                            <option>Food</option>
                            <option>Funds</option>
                            <option>Clothes</option>
                            <option>Medical</option>
                            <option>Essentials</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description of Need</label>
                        <textarea name="description" rows="3" required className="input-field mt-1" placeholder="Describe your situation..." onChange={handleChange}></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity / Amount Needed</label>
                        <input name="quantity" type="text" required className="input-field mt-1" placeholder="e.g., 5 food packets, 2000 INR" onChange={handleChange} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input name="city" type="text" required className="input-field mt-1" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input name="state" type="text" required className="input-field mt-1" onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address / Location Details</label>
                        <input name="address" type="text" required className="input-field mt-1" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Proof of ID / Need (Image URL) - Optional</label>
                        <input name="proofOfNeed" type="text" className="input-field mt-1" placeholder="Link to photo or ID" onChange={handleChange} />
                    </div>

                    <button type="submit" className="w-full btn-primary py-3">Submit Request</button>
                </form>
            </div>
        </div>
    );
};

export default RequestHelp;
