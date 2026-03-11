const TopResources = ({ stats }) => {
    const top3 = Object.entries(stats.byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Top Resources Needed</h3>
            <p className="text-gray-500 text-sm mb-6 uppercase tracking-wider font-semibold">Most Requested Aid Categories</p>
            <div className="space-y-5">
                {top3.map(([type, count], index) => {
                    const percentage = Math.round((count / stats.total) * 100);
                    const colors = ['bg-red-500', 'bg-purple-600', 'bg-blue-500'];
                    return (
                        <div key={type}>
                            <div className="flex justify-between text-sm mb-2 font-bold">
                                <span className="text-gray-700">{index + 1}. {type}</span>
                                <span className="text-gray-500">{count} Requests</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className={`${colors[index]} h-2.5 rounded-full transition-all duration-1000`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopResources;
