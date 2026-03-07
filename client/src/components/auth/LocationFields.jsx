const LocationFields = ({ handleChange }) => (
    <div className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-2">
            <input name="city" type="text" required className="border p-2.5 rounded-lg w-full" placeholder="City" onChange={handleChange} />
            <input name="state" type="text" required className="border p-2.5 rounded-lg w-full" placeholder="State" onChange={handleChange} />
        </div>
        <input name="address" type="text" required className="border p-2.5 rounded-lg w-full" placeholder="Address" onChange={handleChange} />
        <input name="zip" type="text" required className="border p-2.5 rounded-lg w-full" placeholder="Zip" onChange={handleChange} maxLength="6" pattern="\d*" />
    </div>
);

export default LocationFields;
