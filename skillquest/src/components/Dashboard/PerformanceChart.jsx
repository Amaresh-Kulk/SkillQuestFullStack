import React from 'react';
import PerformanceChart from './PerformanceChart';

const App = () => {
    const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        joinDate: '2023-01-15',
    };

    const data = [
        {
            date: '2023-12-01',
            scores: { aptitude: 50, coding: 70 },
        },
        {
            date: '2023-12-10',
            scores: { aptitude: 65, coding: 80 },
        },
        {
            date: '2023-12-20',
            scores: { aptitude: 75, coding: 90 },
        },
    ];

    return <PerformanceChart data={data} user={user} />;
};

export default App;