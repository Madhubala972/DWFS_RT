import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const useDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchRequests = useCallback(async (currUser) => {
        try {
            const config = { headers: { Authorization: `Bearer ${currUser.token}` } };
            const url = ['admin', 'ngo', 'volunteer'].includes(currUser.role) ? 'http://localhost:5000/api/requests' : 'http://localhost:5000/api/requests/my';
            const { data } = await axios.get(url, config);
            setRequests(data);
        } catch (e) {
            if (e.response?.status === 401) { localStorage.removeItem('user'); navigate('/login'); }
        }
    }, [navigate]);

    const updateStatus = async (id, status, extraData = {}) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = { status, ...extraData };
            if (status === 'Assigned' && user.role === 'volunteer') payload.assignedTo = user._id;
            await axios.put(`http://localhost:5000/api/requests/${id}`, payload, config);
            alert(`Request updated to ${status}`);
            fetchRequests(user);
        } catch (error) {
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
