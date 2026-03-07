const FormFields = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Type of Assistance</label>
            <select name="type" className="w-full p-2 border rounded" value={formData.type} onChange={handleChange}>
                <option value="Food">Food / Rations</option>
                <option value="Funds">Financial Support</option>
                <option value="Medical">Medical / First Aid</option>
                <option value="Clothes">Clothing</option>
                <option value="Essentials">Shelter / Essentials</option>
                <option value="Other">Other</option>
            </select>
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Description of Need</label>
            <textarea name="description" rows="3" className="w-full p-2 border rounded" placeholder="Details of your situation..." value={formData.description} onChange={handleChange}></textarea>
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Quantity / Units</label>
            <input type="text" name="quantity" className="w-full p-2 border rounded" placeholder="e.g. 5kg, 3 units" value={formData.quantity} onChange={handleChange} />
        </div>
    </div>
);

export default FormFields;
