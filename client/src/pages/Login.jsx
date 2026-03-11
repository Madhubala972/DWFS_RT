import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err) { alert(err.response?.data?.message || 'Login failed'); }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border">
                <h2 className="text-center text-3xl font-bold">Sign In</h2>
                <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default Login;
