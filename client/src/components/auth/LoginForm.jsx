import { Link } from 'react-router-dom';

const LoginForm = ({ email, setEmail, password, setPassword, onSubmit, loading }) => (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
            <input type="email" required className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" required className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-95 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}>
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing in...
                </span>
            ) : "Sign in"}
        </button>
        <div className="text-center">
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Need an account? Register</Link>
        </div>
    </form>
);

export default LoginForm;
