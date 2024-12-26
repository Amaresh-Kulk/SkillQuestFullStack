import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Register.css'; // Ensure the correct import path for the CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        const { username, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                'http://localhost:8000/api/users/register',
                { username, email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            setMessage('Registration successful! Logging you in...');

            // Automatically log the user in after registration
            const loginRes = await axios.post(
                'http://localhost:8000/api/users/login',
                { email, password },
                { withCredentials: true }
            );

            // Store the user and token in localStorage
            const { token, user } = loginRes.config.data;
            console.log(loginRes.config);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect to the profile page
            navigate('/dashboard/profile');
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Error registering. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="heading">
                <h1>Create Your Account</h1>
                <p>Please fill in the details below to sign up.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                />
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
                <label>Confirm Password:</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && (
                <p className={message.includes('successful') ? 'success' : 'error'}>{message}</p>
            )}
        </div>
    );
};

export default Register;
