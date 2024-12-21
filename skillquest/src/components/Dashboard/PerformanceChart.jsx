import React from 'react';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const PerformanceChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    const chartData = {
        labels: data.map((entry) => new Date(entry.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Aptitude Score',
                data: data.map((entry) => entry.scores.aptitude),
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                tension: 0.4, // Adds a curve to the line
                fill: false,
            },
            {
                label: 'Coding Score',
                data: data.map((entry) => entry.scores.coding),
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Score',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ height: '400px' }}>
            <h2>Performance Chart</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default PerformanceChart;
