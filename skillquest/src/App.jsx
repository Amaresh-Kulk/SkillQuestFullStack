import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PerformanceChart from './components/Dashboard/PerformanceChart';
import AptitudeQuestions from './components/Dashboard/AptitudeList';
import CodingQuestions from './components/Dashboard/CodingList';
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
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch performance data for dashboard
    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/performance`);
                setPerformanceData(res.data);
            } catch (err) {
                setError('Error fetching performance data. Please try again later.');
                console.error('Error fetching performance data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, []);

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/dashboard/performance" 
                    element={
                        loading ? <p>Loading performance data...</p> : error ? <p>{error}</p> : <PerformanceChart data={performanceData} />
                    }
                />
                <Route path="/dashboard/aptitude" element={<AptitudeQuestions />} />
                <Route path="/dashboard/coding" element={<CodingQuestions />} />
            </Routes>
        </>
    );
};

export default App;
