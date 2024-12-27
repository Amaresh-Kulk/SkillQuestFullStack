import React, { useEffect, useRef } from 'react';
import { format, subDays } from 'date-fns';
import './styles/HeatMap.css';

const Heatmap = ({ data, title }) => {
  const containerRef = useRef(null);

  const generateCells = () => {
    const today = new Date();
    const cells = [];
    
    // Group the data by submission date and count the number of questions answered each day
    const activityByDate = data.reduce((acc, item) => {
      const date = new Date(item.submissionDate).toISOString().split('T')[0]; // Only the date part (yyyy-mm-dd)
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Generate cells for the heatmap (showing number of questions answered per day)
    for (let i = 365; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const value = activityByDate[dateStr] || 0;
      cells.push({ date, value });
    }

    return cells;
  };

  const getColor = (value, isDarkMode) => {
    // Dark mode colors
    if (1) {
      if (value === 0) return '#2d3748'; // No activity (darker shade for dark mode)
      if (value <= 2) return '#38b2ac'; // Low activity (teal)
      if (value <= 4) return '#4fd1c5'; // Moderate activity (lighter teal)
      if (value <= 6) return '#3182ce'; // High activity (blue)
      return '#2b6cb0'; // Very high activity (darker blue)
    }
  
    // Light mode colors (default behavior)
    if (value === 0) return '#ebedf0'; // No activity
    if (value <= 2) return '#9be9a8'; // Low activity (light green)
    if (value <= 4) return '#40c463'; // Moderate activity (green)
    if (value <= 6) return '#30a14e'; // High activity (darker green)
    return '#216e39'; // Very high activity (dark green)
  };

  useEffect(() => {
    const container = containerRef.current;
    container.innerHTML = ''; // Clear existing content
    const cells = generateCells();

    const titleElement = document.createElement('h3');
    titleElement.textContent = `${title} Streak`;
    titleElement.className = 'heatmap-title';

    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';

    cells.forEach(({ date, value }) => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.style.backgroundColor = getColor(value);
      cell.setAttribute('data-value', value); // Set the data-value attribute
      const formattedDate = format(date, 'MMM d, yyyy');
      cell.title = `${formattedDate}: ${value} question(s)`;
      grid.appendChild(cell);
    });

    container.appendChild(titleElement);
    container.appendChild(grid);
  }, [data]);

  return <div ref={containerRef} className="heatmap"></div>;
};

export default Heatmap;
