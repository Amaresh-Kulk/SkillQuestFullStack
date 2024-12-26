import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Login.css'; // Ensure this path is correct
import Cookies from 'js-cookie';






const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Auto-login on page load if the user is already stored in localStorage or sessionStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (storedUser && storedToken) {
            // Optionally, you can make an API call here to verify the token or check if it's still valid
            console.log('User is already logged in');
            // Redirect to the dashboard or another page if desired
        }
    }, []);
    // const getTokenFromCookies = () => {
    //     const cookies = document.cookie; // Retrieves all cookies as a single string
    //     const tokenCookie = cookies.split('; ').find(row => row.startsWith('token='));
    //     return tokenCookie ? tokenCookie.split('=')[1] : null;
    // };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
    
        try {
            const res = await axios.post(
                `http://localhost:8000/api/users/login`,
                { email, password },
                { withCredentials: true } // Ensures cookies are sent/received
            );
    
            const { token, message } = res.data; // Extract token and message from the response
            console.log('Token received from response:', token);
    
            // Store the token in localStorage
            if (token) {
                localStorage.setItem('token', token);
            } else {
                console.error('Token not found in response');
            }
    
            setMessage(message || 'Login successful!');
            // Optionally redirect to another page
            // window.location.href = '/dashboard/profile';
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                setMessage(err.response.data.msg); // Backend error message
            } else {
                setMessage('Error logging in. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };
    

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        
        // Optionally, redirect to login or home page
        window.location.href = '/login';
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
                    <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                    />
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

            {/* If the user is logged in, show a logout button */}
            {localStorage.getItem('token') || sessionStorage.getItem('token') ? (
                <button onClick={handleLogout} className="btn-primary">
                    Log Out
                </button>
            ) : null}
        </div>
    );
};

export default Login;
