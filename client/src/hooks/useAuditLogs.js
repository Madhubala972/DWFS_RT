import { useState, useEffect } from 'react';
import axios from 'axios';
import { AUDIT_MOCK_DATA } from '../constants/mockData';

export const useAuditLogs = () => {
    const [logs, setLogs] = useState(AUDIT_MOCK_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/logs', config);
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
