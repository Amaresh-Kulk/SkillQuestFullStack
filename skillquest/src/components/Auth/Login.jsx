import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Send login request
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
                email,
                password,
            });

            // Store token and user data in localStorage
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user)); // Store user details for future use

            setMessage('Login successful!');
            
            // Redirect to the Profile page after login
            navigate('/user/profile');
        } catch (err) {
            // Error handling for API response
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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            {message && <p className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
            </p>}
        </div>
    );
};

export default Login;
