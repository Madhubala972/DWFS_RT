import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import DesktopMenu from './navbar/DesktopMenu';
import MobileMenu from './navbar/MobileMenu';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        try {
                await api.post('/auth/logout', {});
        } catch (e) { console.error(e); }
        localStorage.removeItem('user'); navigate('/login');
    };

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 flex justify-between h-16">
                <div className="flex items-center">
                    <Link to="/" className="text-xl font-bold text-white">DISASTER <span className="text-blue-200">RELIEF</span></Link>
                </div>
                <DesktopMenu user={user} handleLogout={handleLogout} />
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && <MobileMenu user={user} handleLogout={handleLogout} />}
        </nav>
    );
};

export default Navbar;
