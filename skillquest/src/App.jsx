import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AptitudeQuestions from './components/Dashboard/AptitudeList';
import CodingList from './components/Dashboard/CodingList';
import Profile from './components/Dashboard/Profile.jsx';
import HomePage from './components/Dashboard/HomePage.jsx';
import Footer from './components/Footer.jsx';
import { useState, useEffect } from 'react';


const App = () => {
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true); // User is logged in
        }
    }, []);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/aptitude" element={<AptitudeQuestions />} />
                <Route path="/dashboard/coding" element={<CodingList />} />
                <Route path="/dashboard/profile" element={ <Profile /> } />
            </Routes>
            <Footer />
            {error && <p className="error-message">{error}</p>}
        </>
    );
};

export default App;
