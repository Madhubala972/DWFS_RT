import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const useDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchRequests = useCallback(async (currUser) => {
        try {
            const url = ['admin', 'ngo', 'volunteer'].includes(currUser.role) ? '/api/requests' : '/api/requests/my';
            const { data } = await api.get(url);
            setRequests(data);
        } catch (e) {
            if (e.response?.status === 401) { localStorage.removeItem('user'); navigate('/login'); }
        }
    }, [navigate]);

    const updateStatus = async (id, status, extraData = {}) => {
        try {
            const payload = { status, ...extraData };
            if (status === 'Assigned' && user.role === 'volunteer') payload.assignedTo = user._id;
            await api.put(`/api/requests/${id}`, payload);
            alert(`Request updated to ${status}`);
            fetchRequests(user);
        } catch (error) {
// ...
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user'));
        if (stored) { setUser(stored); fetchRequests(stored); }
        else navigate('/login');
    }, [navigate, fetchRequests]);

    return { requests, user, fetchRequests, updateStatus };
};
