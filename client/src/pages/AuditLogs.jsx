import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShieldAlt } from 'react-icons/fa';
import { AUDIT_MOCK_DATA } from '../constants/mockData';
import LogTable from '../components/audit/LogTable';

const AuditLogs = () => {
    const [logs, setLogs] = useState(AUDIT_MOCK_DATA);
    const [filteredLogs, setFilteredLogs] = useState(AUDIT_MOCK_DATA);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/logs', config);
                const combinedLogs = [...data, ...AUDIT_MOCK_DATA];
                setLogs(combinedLogs);
                setFilteredLogs(combinedLogs);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching logs:', error);
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    useEffect(() => {
        let result = logs;
        const now = new Date();
        if (filterType === 'TODAY') {
            const today = new Date().setHours(0, 0, 0, 0);
            result = result.filter(log => new Date(log.createdAt).getTime() >= today);
        } else if (filterType === 'WEEK') {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            result = result.filter(log => new Date(log.createdAt).getTime() >= weekAgo.getTime());
        } else if (filterType === 'MONTH') {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            result = result.filter(log => new Date(log.createdAt).getTime() >= monthAgo.getTime());
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(log =>
                log.action.toLowerCase().includes(term) ||
                log.details.toLowerCase().includes(term) ||
                log.user?.name?.toLowerCase().includes(term) ||
                log.ipAddress?.includes(term)
            );
        }
        setFilteredLogs(result);
    }, [searchTerm, filterType, logs]);

    const getDisplayLogs = () => {
        const paired = new Set();
        const displayItems = [];
        const sortedLogs = [...filteredLogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        for (let i = 0; i < sortedLogs.length; i++) {
            if (paired.has(sortedLogs[i]._id)) continue;
            const log = sortedLogs[i];

            if (log.action === 'LOGOUT') {
                const loginIndex = sortedLogs.findIndex((l, idx) =>
                    idx > i && l.user?._id === log.user?._id && l.action === 'LOGIN' && !paired.has(l._id)
                );
                if (loginIndex !== -1) {
                    const loginLog = sortedLogs[loginIndex];
                    displayItems.push({
                        _id: `session-${log._id}`,
                        loginTime: loginLog.createdAt,
                        logoutTime: log.createdAt,
                        user: log.user,
                        isSession: true,
                        action: 'SESSION',
                        details: `Full Session activity recorded.`,
                        ipAddress: log.ipAddress
                    });
                    paired.add(loginLog._id);
                    paired.add(log._id);
                } else {
                    displayItems.push({ ...log, logoutTime: log.createdAt });
                }
            } else if (log.action === 'LOGIN') {
                displayItems.push({ ...log, loginTime: log.createdAt });
            } else {
                displayItems.push({ ...log, actionTime: log.createdAt });
            }
        }
        return displayItems;
    };

    const displayLogs = getDisplayLogs();
    if (loading) return <div className="p-10 text-center">Loading Audit Trails...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-blue-600 text-white py-12 mb-10">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <FaShieldAlt className="text-blue-200" /> Transparent <span className="text-blue-200">Audit Trails</span>
                        </h1>
                        <p className="text-blue-100 mt-2">Full governance logs for system decisions and activity.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search logs..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-3.5 top-3 text-gray-400">🔍</div>
                        </div>
                        <div className="flex gap-2">
                            {['TODAY', 'WEEK', 'MONTH', 'ALL'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilterType(t)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wide ${filterType === t ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {t.toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <LogTable displayLogs={displayLogs} />
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
