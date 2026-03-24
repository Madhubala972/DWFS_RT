import { useState, useEffect } from 'react';
import api from '../api/axios';
import { AUDIT_MOCK_DATA } from '../constants/mockData';

export const useAuditLogs = () => {
    const [logs, setLogs] = useState(AUDIT_MOCK_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data } = await api.get('/logs');
                setLogs([...data, ...AUDIT_MOCK_DATA]);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    return { logs, loading };
};
