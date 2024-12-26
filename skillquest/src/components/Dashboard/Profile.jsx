import { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './styles/Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('Easy');
    const [submissionError, setSubmissionError] = useState(null); // Track errors in fetching submissions

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            setSubmissionError(null);

            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const [userRes, submissionsRes, problemsRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/users/me', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8000/api/submissions/user/me', { headers: { Authorization: `Bearer ${token}` } }), // Fetch submissions for current user
                    axios.get('http://localhost:8000/api/coding', { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setUser(userRes.data);
                setSubmissions(submissionsRes.data); // Assuming submissions response is an array
                setProblems(problemsRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a832a6'];
    const difficultyKeys = ['School', 'Basic', 'Easy', 'Medium', 'Hard'];

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const solvedByDifficulty = difficultyKeys.map((key) => ({
        name: key,
        value: user?.problemCounts?.[key.toLowerCase()] || 0,
    }));

    return (
        <div className="profile-container">
            {/* User Info */}
            <div className="card user-info">
                <p><strong>{user?.username || 'N/A'}</strong></p>
                <p>{user?.email || 'N/A'}</p>
            </div>

            {/* Daily Streaks */}
            <div className="card heatmap">
                <h3>Daily Submissions</h3>
                <CalendarHeatmap
                    startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                    endDate={new Date()}
                    values={submissions}
                    classForValue={(value) => {
                        if (!value || value.count === 0) return 'color-empty';
                        if (value.count > 10) return 'color-scale-4';
                        if (value.count > 5) return 'color-scale-3';
                        if (value.count > 2) return 'color-scale-2';
                        return 'color-scale-1';
                    }}
                    tooltipDataAttrs={(value) => ({
                        'data-tooltip': value?.date ? `${value.date}: ${value.count || 0} submissions` : 'No submissions',
                    })}
                />
            </div>

            {/* Problems Solved */}
            <div className="card problems">
                <div className="problems-header">
                    <div className="tabs">
                        {difficultyKeys.map((key) => (
                            <button
                                key={key}
                                className={`tab ${currentTab === key ? 'active' : ''}`}
                                onClick={() => setCurrentTab(key)}
                            >
                                {key} ({user?.problemCounts?.[key.toLowerCase()] || 0})
                            </button>
                        ))}
                    </div>
                    <div className="pie-chart">
                        <PieChart width={300} height={300}>
                            <Pie
                                data={solvedByDifficulty}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {solvedByDifficulty.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </div>
                <ul className="problem-list">
                    {problems
                        ?.filter((problem) => problem.difficulty === currentTab)
                        .map((problem) => (
                            <li key={problem.id}>{problem.title}</li>
                        ))}
                </ul>
            </div>

            {/* Submissions Section */}
            <div className="card submissions">
                <h3>Recent Submissions</h3>
                {submissionError && <p style={{ color: 'red' }}>{submissionError}</p>}
                {submissions.length === 0 ? (
                    <p>No submissions found</p>
                ) : (
                    <ul>
                        {submissions.map((submission) => (
                            <li key={submission._id}>
                                <p><strong>Question: {submission.questionId?.title || 'N/A'}</strong></p>
                                <p>Language: {submission.language}</p>
                                <p>Code:</p>
                                <pre>{submission.code}</pre>
                                {submission.output && (
                                    <>
                                        <p><strong>Output:</strong></p>
                                        <pre>{submission.output}</pre>
                                    </>
                                )}
                                {submission.error && (
                                    <>
                                        <p><strong>Error:</strong></p>
                                        <pre>{submission.error}</pre>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Profile;
