import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaHistory, FaUserShield, FaNetworkWired, FaServer } from 'react-icons/fa';

const AuditLogs = () => {
    const mockData = [
        {
            _id: 'mock1',
            createdAt: new Date().toISOString(),
            action: 'AI_PRIORITIZATION',
            user: { name: 'System AI', role: 'admin' },
            details: 'Calculated Critical priority (Score: 92) for Medical Aid request in Flood Zone.',
            ipAddress: '192.168.1.1'
        },
        {
            _id: 'mock2',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            action: 'USER_LOGIN',
            user: { name: 'Admin User', role: 'admin' },
            details: 'Admin session started successfully.',
            ipAddress: '203.0.113.42'
        },
        {
            _id: 'mock8',
            createdAt: new Date(Date.now() - 600000).toISOString(), // 10 mins ago
            action: 'LOGOUT',
            user: { name: 'Admin User', role: 'admin' },
            details: 'User logged out successfully. Active session terminated.',
            ipAddress: '203.0.113.42'
        },
        {
            _id: 'mock9',
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            action: 'LOGIN',
            user: { name: 'Rahul Volunteer', role: 'volunteer' },
            details: 'Volunteer session started safely via mobile device.',
            ipAddress: '49.15.22.101'
        },
        {
            _id: 'mock10',
            createdAt: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
            action: 'LOGOUT',
            user: { name: 'Rahul Volunteer', role: 'volunteer' },
            details: 'User logged out. Volunteer session finalized.',
            ipAddress: '49.15.22.101'
        },
        {
            _id: 'mock3',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            action: 'RESOURCE_ALLOCATION',
            user: { name: 'Asha Center', role: 'ngo' },
            details: 'Allocated 500kg Rice to High-priority cluster in Zone-B.',
            ipAddress: '172.16.254.1'
        },
        {
            _id: 'mock4',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            action: 'AI_PRIORITIZATION',
            user: { name: 'Priya Sharma', role: 'user' },
            details: 'Mapped Medium priority (Score: 45) for Clothes request. No vulnerability flags detected.',
            ipAddress: 'Internal'
        },
        {
            _id: 'mock5',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 Days ago
            action: 'SECURITY_ALERT',
            user: { name: 'System Sentinel', role: 'admin' },
            details: 'Blocked suspicious login attempt from unrecognized region.',
            ipAddress: '45.76.12.190'
        },
        {
            _id: 'mock6',
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 Week ago
            action: 'DATA_BACKUP',
            user: { name: 'DB Instance', role: 'admin' },
            details: 'Full socio-economic dataset backed up to encrypted storage.',
            ipAddress: 'Local'
        },
        {
            _id: 'mock7',
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), // 1 Month ago
            action: 'AI_RETRAINING',
            user: { name: 'ML Pipeline', role: 'admin' },
            details: 'Model Dis_V2 retrained with 5,000 new human-verified samples. Accuracy increased by 2.4%.',
            ipAddress: 'GPU_Node_01'
        }
    ];

    const [logs, setLogs] = useState(mockData);
    const [filteredLogs, setFilteredLogs] = useState(mockData);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL'); // 'TODAY' or 'ALL'

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/logs', config);
                const combinedLogs = [...data, ...mockData];
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

        // Date Filtering
        if (filterType === 'TODAY') {
            const today = new Date().setHours(0, 0, 0, 0);
            result = result.filter(log => new Date(log.createdAt).getTime() >= today);
        }

        // Search Filtering
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

    if (loading) return <div className="p-10 text-center">Loading Audit Trails...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
            >
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <FaShieldAlt className="text-primary" /> Transparent Audit Trails
                    </h1>
                    <p className="text-gray-500">Full governance logs for AI decisions and system activity.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-700">NODE_01: ACTIVE</span>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
                        <FaServer className="text-blue-500 text-xs" />
                        <span className="text-xs font-bold text-blue-700">AUTOSCALING: ENABLED</span>
                    </div>
                </div>
            </motion.div>

            <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search logs (e.g. AI_PRIORITIZATION)..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-4 top-3.5 text-gray-400 text-xs font-bold uppercase">🔍</div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterType('TODAY')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${filterType === 'TODAY' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setFilterType('ALL')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${filterType === 'ALL' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-50 shadow-[0_4px_10px_-5px_rgba(0,0,0,0.05)] sticky top-0 z-10">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Entity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Decision Matrix / Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">IP Fingerprint</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLogs.map((log, index) => (
                                <motion.tr
                                    key={log._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="hover:bg-blue-50/20 transition-colors"
                                >
                                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter ${log.action.includes('CREATE') ? 'bg-purple-100 text-purple-700' :
                                            log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800">{log.user?.name || 'System Entity'}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-black">
                                                {log.user?.role === 'user' ? 'Affected User' :
                                                    log.user?.role === 'ngo' ? 'NGO' :
                                                        log.user?.role || 'System'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 italic">
                                        {log.details}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                                        {log.ipAddress || 'Internal'}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
