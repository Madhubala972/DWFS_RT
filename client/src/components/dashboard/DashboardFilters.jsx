const DashboardFilters = ({ user, filter, setFilter }) => {
    if (!['admin', 'ngo', 'volunteer'].includes(user.role)) return null;

    const baseFilters = ['All', 'Pending', 'Approved'];
    const volFilters = user.role === 'volunteer' ? ['Available', 'My Tasks'] : ['Assigned'];
    const allFilters = [...baseFilters, ...volFilters, 'Delivered'];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {allFilters.map(f => (
                <button
                    key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm transition-all ${filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                    {f.replace(/([A-Z])/g, ' $1').trim()}
                </button>
            ))}
        </div>
    );
};

export default DashboardFilters;
