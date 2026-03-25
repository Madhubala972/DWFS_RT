import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            
            // Warm up the AI server in the background so it's ready when they submit a request
            api.get('/api/requests/warmup').catch(() => {}); 
            
            navigate('/dashboard');
        } catch (err) { 
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border">
                <h2 className="text-center text-3xl font-bold">Sign In</h2>
                {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium animate-shake">{error}</div>}
                <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
};

export default Login;
