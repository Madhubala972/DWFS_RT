const AuditControls = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => (
    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
            <input
                type="text" placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">🔍</div>
        </div>
        <div className="flex gap-2">
            {['TODAY', 'WEEK', 'MONTH', 'ALL'].map(t => (
                <button
                    key={t} onClick={() => setFilterType(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${filterType === t ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-500'}`}
                >
                    {t.toLowerCase()}
                </button>
            ))}
        </div>
    </div>
);

export default AuditControls;
