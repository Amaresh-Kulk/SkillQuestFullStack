import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import * as jwtDecode from 'jwt-decode'; // Wildcard import

const Navbar = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode.default(token); // Access the default function
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
            <div className="navbar-container">
                {/* Left Section */}
                <div className="navbar-left">
                    <Link to="/" aria-label="Go to Home Page">SkillQuest</Link>
                </div>

                {/* Right Section (Navigation Links) */}
                <div className="navbar-right">
                    <div className="nav-links">
                        <Link to="/" aria-label="Go to Home Page">Home</Link>
                        <Link to="/login" aria-label="Login to your account">Login</Link>
                        <Link to="/register" aria-label="Register a new account">Register</Link>
                        <Link to="/dashboard/profile" aria-label="View your profile">Profile</Link>
                        <Link to="/dashboard/aptitude" aria-label="Access aptitude questions">Aptitude</Link>
                        <Link to="/dashboard/coding" aria-label="Access coding questions">Coding</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
