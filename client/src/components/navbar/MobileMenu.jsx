import { Link } from 'react-router-dom';

const MobileMenu = ({ user, handleLogout }) => (
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
);

export default MobileMenu;
