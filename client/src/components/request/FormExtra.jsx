const FormExtra = ({ formData, setFormData }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold mb-1">City</label>
                <input type="text" name="city" className="w-full p-2 border rounded" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Enter city" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Specific Location / Address</label>
                <input type="text" name="location" className="w-full p-2 border rounded" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter detailed address" />
            </div>
            <div>
                <label className="block text-sm font-bold mb-1">Pincode</label>
                <input type="text" name="pincode" className="w-full p-2 border rounded" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="Enter 6-digit pincode" maxLength="6" pattern="\d*" />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.vulnerability.hasElderly} onChange={(e) => setFormData({ ...formData, vulnerability: { ...formData.vulnerability, hasElderly: e.target.checked } })} /> Elderly in family</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.vulnerability.hasDisabled} onChange={(e) => setFormData({ ...formData, vulnerability: { ...formData.vulnerability, hasDisabled: e.target.checked } })} /> Disabled persons</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={formData.locationRisk.isFloodZone} onChange={(e) => setFormData({ ...formData, locationRisk: { ...formData.locationRisk, isFloodZone: e.target.checked } })} /> High risk zone (Flood/Fire)</label>
        </div>
    </div>
);

export default FormExtra;
