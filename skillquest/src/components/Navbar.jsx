// components/Auth/Navbar.jsx
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
// Updated import for jwt-decode
// import jwtDecode from 'jwt-decode'; // Use this if the default export works
// Alternatively, try this if the default export throws an error:
// import { decode as jwtDecode } from 'jwt-decode';
import * as jwtDecode from 'jwt-decode';


const Navbar = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode.default(token); // Access the default export
                const isTokenValid = decoded.exp * 1000 > Date.now(); // Check expiration time

                if (!isTokenValid) {
                    localStorage.removeItem('token'); // Remove expired token
                }
            } catch (error) {
                console.error('Invalid token:', error);
                localStorage.removeItem('token'); // Remove invalid token
            }
        }
    }, []); // Run this effect once when the component mounts

    return (
        <nav role="navigation" aria-label="Main Navigation">
            <h1>Interview Prep</h1>
            <ul>
                <li>
                    <Link to="/" aria-label="Go to Home Page">Home</Link>
                </li>
                <li>
                    <Link to="/login" aria-label="Login to your account">Login</Link>
                </li>
                <li>
                    <Link to="/register" aria-label="Register a new account">Register</Link>
                </li>
                <li>
                    <Link to="/dashboard/profile" aria-label="View your profile">Profile</Link>
                </li>
                <li>
                    <Link to="/dashboard/aptitude" aria-label="Access aptitude questions">Aptitude</Link>
                </li>
                <li>
                    <Link to="/dashboard/coding" aria-label="Access coding questions">Coding</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
