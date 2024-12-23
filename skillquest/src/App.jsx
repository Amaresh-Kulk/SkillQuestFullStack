import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AptitudeQuestions from './components/Dashboard/AptitudeList';
import CodingList from './components/Dashboard/CodingList';
import Profile from './components/Dashboard/Profile.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

// HomePage Component
const HomePage = () => (
    <div>
        <h1>Welcome to Interview Prep!</h1>
        <p>Sharpen your skills with aptitude and coding questions designed to prepare you for interviews.</p>
        <p>Track your progress and improve with every step!</p>
    </div>
);

const App = () => {
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status (e.g., from localStorage or API)
        const user = localStorage.getItem('user'); // Example for checking login status
        if (user) {
            setIsLoggedIn(true); // User is logged in
        }

        // Example API request for initial setup (optional, remove if not needed)
        const fetchData = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_BACKEND_URL}/`);
            } catch (err) {
                setError('Error fetching initial data. Please try again later.');
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard/profile" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/aptitude" element={<AptitudeQuestions />} />
            <Route path="/dashboard/coding" element={<CodingList />} />
            <Route path="/dashboard/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        </Routes>

            {error && <p className="error-message">{error}</p>}
        </>
    );
};

export default App;
