const RegisterFields = ({ formData, handleChange }) => (
    <div className="space-y-4">
        <input name="name" type="text" required className="border w-full p-2.5 rounded-lg" placeholder="Full Name" onChange={handleChange} />
        <input name="email" type="email" required className="border w-full p-2.5 rounded-lg" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" required className="border w-full p-2.5 rounded-lg" placeholder="Password" onChange={handleChange} />
        <input name="phone" type="text" required className="border w-full p-2.5 rounded-lg" placeholder="Phone" onChange={handleChange} maxLength="10" pattern="\d*" />
        <select name="role" className="border w-full p-2.5 rounded-lg" onChange={handleChange} value={formData.role}>
            <option value="user">Affected User</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
        </select>
    </div>
);

export default RegisterFields;
