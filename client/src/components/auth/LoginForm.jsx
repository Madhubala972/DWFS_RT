import { Link } from 'react-router-dom';

const LoginForm = ({ email, setEmail, password, setPassword, onSubmit }) => (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
            <input type="email" required className="border w-full p-3 rounded-lg" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required className="border w-full p-3 rounded-lg" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded-lg font-bold">Sign in</button>
        <div className="text-center">
            <Link to="/register" className="text-blue-600 font-semibold">Need an account? Register</Link>
        </div>
    </form>
);

export default LoginForm;
