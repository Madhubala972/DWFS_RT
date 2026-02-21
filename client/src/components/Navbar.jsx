import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // Mock auth state for now
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = async () => {
        try {
            if (user && user.token) {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                await axios.post('http://localhost:5000/api/auth/logout', {}, config);
            }
        } catch (error) {
            console.error('Logout logging failed', error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <nav className="bg-blue-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-white">
                            DISASTER <span className="text-blue-200">RELIEF</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-white hover:text-blue-100 font-medium transition">Home</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-white hover:text-blue-100 font-medium transition">Dashboard</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/analytics" className="text-white hover:text-blue-100 font-medium transition">Analytics</Link>
                                        <Link to="/ai-strategy" className="text-white hover:text-blue-100 font-medium transition">AI Strategy</Link>
                                    </>
                                )}
                                <Link to="/request-help" className="text-white hover:text-blue-100 font-medium transition">Request Help</Link>
                                <button onClick={handleLogout} className="text-white hover:text-blue-100 font-medium transition">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-blue-100 font-medium transition">Login</Link>
                                <Link to="/register" className="bg-white text-blue-600 px-5 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-50 transition">Register</Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-blue-700 border-t border-blue-500">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">Home</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">Dashboard</Link>
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/analytics" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">Analytics</Link>
                                        <Link to="/ai-strategy" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">AI Strategy</Link>
                                    </>
                                )}
                                <Link to="/request-help" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">Request Help</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-800 transition">Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-bold text-white hover:bg-blue-800 transition">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
