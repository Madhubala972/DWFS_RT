const TrackInput = ({ searchId, setSearchId, handleTrack, loading }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border mb-10">
        <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <input
                type="text" placeholder="Enter Request ID..."
                className="flex-1 p-3 border rounded-lg"
                value={searchId} onChange={(e) => setSearchId(e.target.value)}
            />
            <button
                type="submit" disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50"
            >
                {loading ? 'Searching...' : 'Search'}
            </button>
        </form>
    </div>
);

export default TrackInput;
