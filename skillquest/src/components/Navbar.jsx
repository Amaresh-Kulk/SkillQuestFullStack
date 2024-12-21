import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav role="navigation">
            <h1>Interview Prep</h1>
            <ul>
                <li><Link to="/" aria-label="Go to Home">Home</Link></li>
                <li><Link to="/login" aria-label="Login to your account">Login</Link></li>
                <li><Link to="/register" aria-label="Register a new account">Register</Link></li>
                <li><Link to="/dashboard/performance" aria-label="View performance chart">Performance</Link></li>
                <li><Link to="/dashboard/questions" aria-label="View available questions">Questions</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
