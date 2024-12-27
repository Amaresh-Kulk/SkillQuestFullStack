import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './styles/Profile.css';
import profilePhoto from './images/Batmobile.jpg';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [aptitudeData, setAptitudeData] = useState(null);
  const [codingData, setCodingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const aptitudeStreaksChartRef = useRef(null);
  const aptitudeDonutChartRef = useRef(null);
  const codingStreaksChartRef = useRef(null);
  const codingDonutChartRef = useRef(null);

  const initChart = (chartRef, chartId, data, options) => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const ctx = document.getElementById(chartId).getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: options.type,
      data: data,
      options: options.chartOptions,
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded?.user?.id;
        if (!userId) {
          setError('Invalid token');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch data
        const aptitudeRes = await axios.get(`http://localhost:8000/api/aptitudeSubmissions/${userId}`, config);
        const codingRes = await axios.get(`http://localhost:8000/api/submissions/${userId}`, config);
        const userRes = await axios.get(`http://localhost:8000/api/users/${userId}`, config);

        // // Debug logs for API responses
        // console.log('Aptitude API Response:', aptitudeRes.data);
        // console.log('Coding API Response:', codingRes.data);
        // console.log('User API Response:', userRes.data);

        // Fetch question difficulties for aptitude submissions
        const aptitudeSubmissions = await Promise.all(
          aptitudeRes.data.submissions.map(async (submission) => {
            const questionRes = await axios.get(
              `http://localhost:8000/api/aptitude/${submission.questionId._id}`,
              config
            );
            return { ...submission, questionId: { ...submission.questionId, difficulty: questionRes.data.difficulty || 'unknown' } };
          })
        );

        // Fetch question difficulties for coding submissions
        const codingSubmissions = await Promise.all(
          codingRes.data.submissions.map(async (submission) => {
            const questionRes = await axios.get(
              `http://localhost:8000/api/coding/${submission.questionId._id}`,
              config
            );
            return { ...submission, questionId: { ...submission.questionId, difficulty: questionRes.data.difficulty || 'unknown' } };
          })
        );

        setAptitudeData({ submissions: aptitudeSubmissions });
        setCodingData({ submissions: codingSubmissions });
        setUserData(userRes.data);

        setLoading(false);
      } catch (err) {
        // console.error('Error fetching data:', err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateStreaks = (data) => {
    const streaks = {};
    let currentStreak = 0;
    let lastSubmissionDate = null;

    data.forEach((item) => {
      const submissionDate = new Date(item.submissionDate).toISOString().split('T')[0];
      if (
        lastSubmissionDate &&
        new Date(submissionDate) - new Date(lastSubmissionDate) === 86400000
      ) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      streaks[submissionDate] = currentStreak;
      lastSubmissionDate = submissionDate;
    });

    return streaks;
  };

  const groupDataByDifficulty = (data) => {
    const grouped = { easy: 0, medium: 0, hard: 0 };

    if (!data.submissions || !Array.isArray(data.submissions)) {
      console.error('Invalid submissions data:', data);
      return grouped;
    }

    data.submissions.forEach((item) => {
      const difficulty = item.questionId?.difficulty;
      if (difficulty === 'easy') {
        grouped.easy++;
      } else if (difficulty === 'medium') {
        grouped.medium++;
      } else if (difficulty === 'hard') {
        grouped.hard++;
      } else {
        console.warn('Unknown difficulty:', difficulty);
      }
    });

    return grouped;
  };

  useEffect(() => {
    if (!aptitudeData || !codingData || loading) return;

    const aptitudeStreaks = calculateStreaks(aptitudeData.submissions);
    const aptitudeGrouped = Object.entries(aptitudeStreaks).reduce((acc, [date, streak]) => {
      const day = new Date(date).toLocaleString('en-US', { weekday: 'short' });
      acc[day] = acc[day] ? acc[day] + streak : streak;
      return acc;
    }, {});

    const aptitudeDifficultyGrouped = groupDataByDifficulty(aptitudeData);
    const codingDifficultyGrouped = groupDataByDifficulty(codingData);

    // Debug final data
    console.log('Aptitude Streaks:', aptitudeGrouped);
    console.log('Aptitude Difficulty:', aptitudeDifficultyGrouped);
    console.log('Coding Difficulty:', codingDifficultyGrouped);

    initChart(
      aptitudeStreaksChartRef,
      'aptitudeStreaksChart',
      {
        labels: Object.keys(aptitudeGrouped),
        datasets: [
          {
            label: 'Aptitude Streaks',
            data: Object.values(aptitudeGrouped),
            borderColor: '#4F46E5',
            tension: 1,
          },
        ],
      },
      {
        type: 'line',
        chartOptions: { responsive: true, plugins: { legend: { display: false } } },
      }
    );

    initChart(
      aptitudeDonutChartRef,
      'aptitudeDonutChart',
      {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
          {
            data: [
              aptitudeDifficultyGrouped.easy,
              aptitudeDifficultyGrouped.medium,
              aptitudeDifficultyGrouped.hard,
            ],
            backgroundColor: ['#22C55E', '#EAB308', '#EF4444'],
          },
        ],
      },
      {
        type: 'doughnut',
        chartOptions: { responsive: true, plugins: { legend: { display: true } } },
      }
    );

    const codingStreaks = calculateStreaks(codingData.submissions);
    const codingGrouped = Object.entries(codingStreaks).reduce((acc, [date, streak]) => {
      const day = new Date(date).toLocaleString('en-US', { weekday: 'short' });
      acc[day] = acc[day] ? acc[day] + streak : streak;
      return acc;
    }, {});

    initChart(
      codingStreaksChartRef,
      'codingStreaksChart',
      {
        labels: Object.keys(codingGrouped),
        datasets: [
          {
            label: 'Coding Streaks',
            data: Object.values(codingGrouped),
            borderColor: '#F59E0B',
            tension: 1,
          },
        ],
      },
      {
        type: 'line',
        chartOptions: { responsive: true, plugins: { legend: { display: false } } },
      }
    );

    initChart(
      codingDonutChartRef,
      'codingDonutChart',
      {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [
          {
            data: [
              codingDifficultyGrouped.easy,
              codingDifficultyGrouped.medium,
              codingDifficultyGrouped.hard,
            ],
            backgroundColor: ['#22C55E', '#EAB308', '#EF4444'],
          },
        ],
      },
      {
        type: 'doughnut',
        chartOptions: { responsive: true, plugins: { legend: { display: true } } },
      }
    );
  }, [aptitudeData, codingData, loading]);

  


  return (
    <div className="profile-container">
      <div className="profile-section">
        {userData ? (
          <>
            <img src={profilePhoto} alt="Profile" className="profile-photo" />
            <div>
              <h2>{userData.username}</h2>
              <p>{userData.email}</p>
            </div>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
        
      </div>


      <div className="charts-container">
        {loading && <p>Loading charts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="chart-row">
          <div className="chart-section">
            <h3>Aptitude Streaks</h3>
            {aptitudeData?.submissions?.length > 0 ? (
              <canvas id="aptitudeStreaksChart"></canvas>
            ) : (
              <p>No aptitude streak data available yet.</p>
            )}
          </div>
          <div className="chart-section">
            <h3>Aptitude Questions</h3>
            {aptitudeData?.submissions?.length > 0 ? (
              <canvas id="aptitudeDonutChart"></canvas>
            ) : (
              <p>No aptitude question data available yet.</p>
            )}
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-section">
            <h3>Coding Streaks</h3>
            {codingData?.submissions?.length > 0 ? (
              <canvas id="codingStreaksChart"></canvas>
            ) : (
              <p>No coding streak data available yet.</p>
            )}
          </div>
          <div className="chart-section">
            <h3>Coding Questions</h3>
            {codingData?.submissions?.length > 0 ? (
              <canvas id="codingDonutChart"></canvas>
            ) : (
              <p>No coding question data available yet.</p>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Profile;
