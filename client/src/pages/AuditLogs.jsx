import { useState, useMemo } from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { filterLogs, getSessionLogs } from '../utils/auditUtils';
import LogTable from '../components/audit/LogTable';
import AuditHeader from '../components/audit/AuditHeader';
import AuditControls from '../components/audit/AuditControls';

const AuditLogs = () => {
    const { logs, loading } = useAuditLogs();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const displayLogs = useMemo(() => {
        const filtered = filterLogs(logs, searchTerm, filterType);
        return getSessionLogs(filtered);
    }, [logs, searchTerm, filterType]);

    if (loading) return <div className="p-10 text-center">Loading Audit Trails...</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <AuditHeader />
            <div className="max-w-7xl mx-auto px-4 pb-12">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                    <AuditControls
                        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        filterType={filterType} setFilterType={setFilterType}
                    />
                    <LogTable displayLogs={displayLogs} />
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
