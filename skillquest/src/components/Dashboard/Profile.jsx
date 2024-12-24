//components/Dashboard/Profile.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login'); // Redirect to login if no token found
                return;
            }

            try {
                const res = await axios.get('http://localhost:8000/api/users/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                });                
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user profile:', err);
                setError('Failed to load profile. Please try again later.');
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login'); // Redirect to login on unauthorized
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Profile</h2>
            {user && (
                <div>
                    {user.username && <p><strong>Username:</strong> {user.username}</p>}
                    {user.email && <p><strong>Email:</strong> {user.email}</p>}

                    {user.scores && (
                        <div>
                            <h3>Scores</h3>
                            {user.scores.aptitude != null && <p><strong>Aptitude:</strong> {user.scores.aptitude}</p>}
                            {user.scores.coding != null && <p><strong>Coding:</strong> {user.scores.coding}</p>}
                        </div>
                    )}

                    {user.performanceMetrics && user.performanceMetrics.length > 0 && (
                        <div>
                            <h3>Performance Metrics</h3>
                            <ul>
                                {user.performanceMetrics.map((metric, index) => (
                                    <li key={index}>
                                        {metric.section && <p><strong>Section:</strong> {metric.section}</p>}
                                        {metric.score != null && <p><strong>Score:</strong> {metric.score}</p>}
                                        {metric.date && <p><strong>Date:</strong> {new Date(metric.date).toLocaleDateString()}</p>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Display a message if no performance metrics */}
                    {!user.performanceMetrics?.length && <p>No performance metrics available.</p>}
                </div>
            )}
        </div>
    );
};

export default Profile;
