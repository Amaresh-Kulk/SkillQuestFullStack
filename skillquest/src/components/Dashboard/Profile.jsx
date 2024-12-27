import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './styles/Profile.css';
import profilePhoto from './images/Batmobile.jpg';
import Heatmap from './HeatMap'; // Import your Heatmap component

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [aptitudeData, setAptitudeData] = useState(null);
  const [codingData, setCodingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const aptitudeDonutChartRef = useRef(null);
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

        const aptitudeSubmissions = await Promise.all(
          aptitudeRes.data.submissions.map(async (submission) => {
            const questionRes = await axios.get(
              `http://localhost:8000/api/aptitude/${submission.questionId._id}`,
              config
            );
            return { ...submission, questionId: { ...submission.questionId, difficulty: questionRes.data.difficulty || 'unknown' } };
          })
        );

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
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

    const aptitudeDifficultyGrouped = groupDataByDifficulty(aptitudeData);
    const codingDifficultyGrouped = groupDataByDifficulty(codingData);

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
            color: '#e0e0e0',
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

      <div className="charts-container page-container">
        {loading && <p>Loading charts...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="chart-row">
          <div className="chart-section">
            <h3>Aptitude Score</h3>
            {aptitudeData?.submissions?.length > 0 ? (
              <canvas id="aptitudeDonutChart"></canvas>
            ) : (
              <p>No aptitude question data available yet.</p>
            )}
          </div>
          <div className="chart-section heatmap">
            <h3>Activity Heatmap (Aptitude)</h3>
            {aptitudeData?.submissions?.length > 0 ? (
              <Heatmap data={aptitudeData.submissions} title="Aptitude" />
            ) : (
              <p>No aptitude activity data available yet.</p>
            )}
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-section">
            <h3>Coding Score</h3>
            {codingData?.submissions?.length > 0 ? (
              <canvas id="codingDonutChart"></canvas>
            ) : (
              <p>No coding question data available yet.</p>
            )}
          </div>
          <div className="chart-section heatmap">
            <h3>Activity Heatmap (Coding)</h3>
            {codingData?.submissions?.length > 0 ? (
              <Heatmap data={codingData.submissions} title="Coding" />
            ) : (
              <p>No coding activity data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
