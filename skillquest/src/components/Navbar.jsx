import { Link } from 'react-router-dom';

const Navbar = () => {
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
                    <Link to="/dashboard/performance" aria-label="View your performance chart">Performance</Link>
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