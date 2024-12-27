import { Route, Routes, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import the navigate hook
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AptitudeQuestions from './components/Dashboard/AptitudeList';
import CodingList from './components/Dashboard/CodingList';
import Profile from './components/Dashboard/Profile.jsx';
import HomePage from './components/Dashboard/HomePage.jsx';
import Footer from './components/Footer.jsx';
import Erreur from './components/Erreur.jsx';
import { useState, useEffect } from 'react';


const App = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded?.user?.id) {
        setUserLoggedIn(true); // User is logged in
      } else {
        setUserLoggedIn(false); // Token is invalid, log out user
      }
    } else {
      setUserLoggedIn(false); // No token found, log out user
    }
  }, [navigate]);

    return (
        <>
            {/* Render Navbar only if user is logged in */}
            {userLoggedIn && <Navbar />}
            <Routes>
            <Route
                path="/"
                element={userLoggedIn ? <HomePage /> : <Navigate to="/login" />}
            />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/aptitude" element={<AptitudeQuestions />} />
                <Route path="/dashboard/coding" element={<CodingList />} />
                <Route path="/dashboard/profile" element={ <Profile /> } />
                <Route path="*" element={ <Erreur /> } />
            </Routes>
            { userLoggedIn && <Footer /> }
            {error && <p className="error-message">{error}</p>}
        </>
    );
};

export default App;
