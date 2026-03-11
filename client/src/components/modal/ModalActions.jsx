import { Link } from 'react-router-dom';

const ModalActions = ({ role, onNavigate, onClose }) => {
    if (role === 'admin' || role === 'volunteer') {
        const text = role === 'admin' ? 'Review Requests' : 'View Tasks';
        return <button onClick={onNavigate} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow hover:scale-105 transition">{text}</button>;
    }
    return <Link to="/register" onClick={onClose} className="w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold shadow hover:scale-105 transition">Register as Volunteer</Link>;
};

export default ModalActions;
