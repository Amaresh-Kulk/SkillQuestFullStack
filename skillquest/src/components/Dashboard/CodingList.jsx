import { useEffect, useState } from 'react';
import axios from 'axios';

const CodingList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/coding?difficulty=medium');
                setQuestions(res.data); // Ensure res.data is an array of question objects
            } catch (err) {
                console.error('Error fetching coding questions:', err);
                setError('Failed to load coding questions. Please check your connection or try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <p>Loading coding questions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Coding Questions</h2>
            {questions.length > 0 ? (
                questions.map((question) => (
                    <div key={question._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                        <h3>{question.questionText}</h3>
                        <p><strong>Category:</strong> {question.category}</p>
                        <p><strong>Difficulty:</strong> {question.difficulty}</p>
                        <p><strong>Constraints:</strong> {question.constraints}</p>
                        <h4>Example</h4>
                        {question.example && (
                            <>
                                <p><strong>Input:</strong> {question.example.input}</p>
                                <p><strong>Output:</strong> {question.example.output}</p>
                            </>
                        )}
                        <h4>Solution</h4>
                        <pre>{question.solution}</pre>
                    </div>
                ))
            ) : (
                <p>No coding questions available at the moment.</p>
            )}
        </div>
    );
};

export default CodingList;
