import { Link } from 'react-router-dom';

const DesktopMenu = ({ user, handleLogout }) => (
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
                <button onClick={handleLogout} className="text-white hover:text-blue-100 font-medium transition">Logout</button>
            </>
        ) : (
            <>
                <Link to="/login" className="text-white hover:text-blue-100 font-medium transition">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-5 py-1.5 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-50 transition">Register</Link>
            </>
        )}
    </div>
);

export default DesktopMenu;
