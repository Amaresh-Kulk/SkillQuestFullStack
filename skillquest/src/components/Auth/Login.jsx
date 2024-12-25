import { useState } from 'react';
import axios from 'axios';
import './styles/Login.css'; // Ensure this path is correct

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
                email,
                password,
            },
            {
                withCredentials: true,
            });

            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setMessage('Login successful!');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setMessage(err.response.data.error);
            } else {
                setMessage('Error logging in. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="heading">
                <h1>Sign in to your account</h1>
                <p>
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </div>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                </div>
                {message && (
                    <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </p>
                )}
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
                <p className="forgot-password">
                    <a href="/ForgotPassword">Forgot your password?</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
