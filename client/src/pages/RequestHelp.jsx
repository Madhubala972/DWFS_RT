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
        proofOfNeed: '',
        incomeLevel: '',
        hasElderly: false,
        hasDisabled: false,
        familySize: 1,
        isFloodZone: false,
        isDroughtArea: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
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
                incomeLevel: Number(formData.incomeLevel),
                vulnerability: {
                    hasElderly: formData.hasElderly,
                    hasDisabled: formData.hasDisabled,
                    familySize: Number(formData.familySize)
                },
                locationRisk: {
                    isFloodZone: formData.isFloodZone,
                    isDroughtArea: formData.isDroughtArea
                },
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip
                }
            };

            const res = await axios.post('http://localhost:5000/api/requests', payload, config);
            alert(`Request submitted successfully!\nPriority: ${res.data.priority}\nScore: ${res.data.priorityScore}`);
            navigate('/dashboard');
        } catch (error) {
            alert('Error submitting request');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">Request Aid Distribution</h1>
            <div className="card bg-white shadow-xl rounded-2xl p-8 border-t-4 border-primary">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Type of Assistance</label>
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
                            <label className="block text-sm font-semibold text-gray-700">Monthly Family Income (INR)</label>
                            <input name="incomeLevel" type="number" required className="input-field mt-1" placeholder="e.g., 15000" value={formData.incomeLevel} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Description of Need</label>
                        <textarea name="description" rows="3" required className="input-field mt-1" placeholder="Describe your situation in detail..." value={formData.description} onChange={handleChange}></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Quantity / Amount Needed</label>
                            <input name="quantity" type="text" required className="input-field mt-1" placeholder="e.g., 5 food packets, 2000 INR" value={formData.quantity} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Family Size</label>
                            <input name="familySize" type="number" min="1" required className="input-field mt-1" value={formData.familySize} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap gap-6 border border-gray-100">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="hasElderly" checked={formData.hasElderly} onChange={handleChange} className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-gray-700">Elderly Members (60+)</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="hasDisabled" checked={formData.hasDisabled} onChange={handleChange} className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-gray-700">Disabled Members</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="isFloodZone" checked={formData.isFloodZone} onChange={handleChange} className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-gray-700 text-blue-600">Flood-Prone Area</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" name="isDroughtArea" checked={formData.isDroughtArea} onChange={handleChange} className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-gray-700 text-orange-600">Drought-Prone Area</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input name="city" type="text" required className="input-field mt-1" value={formData.city} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input name="state" type="text" required className="input-field mt-1" value={formData.state} onChange={handleChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address / Location Details</label>
                        <input name="address" type="text" required className="input-field mt-1" value={formData.address} onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Proof of ID / Need (Image URL) - Optional</label>
                        <input name="proofOfNeed" type="text" className="input-field mt-1" placeholder="Link to photo or ID" value={formData.proofOfNeed} onChange={handleChange} />
                    </div>

                    <button type="submit" className="w-full btn-primary py-4 text-lg font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02]">Submit Request for AI Prioritization</button>

                </form>
            </div>
        </div>
    );
};

export default RequestHelp;
