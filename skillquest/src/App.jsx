import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PerformanceChart from './components/Dashboard/PerformanceChart';
import QuestionList from './components/Dashboard/QuestionList';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Example of a homepage component
const HomePage = () => (
    <div>
        <h1>Welcome to Interview Prep!</h1>
        <p>Get ready for your interviews with aptitude and coding questions!</p>
    </div>
);

const App = () => {
    const [performanceData, setPerformanceData] = useState([]);

    // Example fetch for performance data, adjust URL as needed
    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/performance');
                setPerformanceData(res.data);
            } catch (err) {
                console.error('Error fetching performance data:', err);
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
                {/* Pass actual data to PerformanceChart */}
                <Route path="/dashboard/performance" element={<PerformanceChart data={performanceData} />} />
                <Route path="/dashboard/questions" element={<QuestionList />} />
            </Routes>
        </>
    );
};

export default App;
