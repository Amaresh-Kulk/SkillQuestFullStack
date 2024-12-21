import { useEffect, useState } from 'react';
import axios from 'axios';

const CodingList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState('medium'); // Default category
    const difficulties = ['easy', 'medium', 'hard'];

    const fetchQuestions = async (difficulty) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:5000/api/coding?difficulty=${difficulty}`);
            setQuestions(res.data); // Ensure res.data is an array of question objects
        } catch (err) {
            console.error('Error fetching coding questions:', err);
            setError('Failed to load coding questions. Please check your connection or try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions(selectedDifficulty); // Fetch questions on component mount or difficulty change
    }, [selectedDifficulty]);

    const handleDifficultyChange = (difficulty) => {
        setSelectedDifficulty(difficulty);
    };

    return (
        <div>
            <h2>Coding Questions</h2>

            {/* Difficulty Selector */}
            <div>
                <h3>Select Difficulty:</h3>
                <ul style={{ display: 'flex', gap: '10px', listStyle: 'none', padding: 0 }}>
                    {difficulties.map((difficulty) => (
                        <li key={difficulty}>
                            <button
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: difficulty === selectedDifficulty ? '#007bff' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleDifficultyChange(difficulty)}
                            >
                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Loading, Error, or Questions Display */}
            {loading ? (
                <p>Loading coding questions...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : questions.length > 0 ? (
                <div>
                    {questions.map((question) => (
                        <div
                            key={question._id}
                            style={{
                                marginBottom: '20px',
                                border: '1px solid #ccc',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        >
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
                    ))}
                </div>
            ) : (
                <p>No coding questions available for "{selectedDifficulty}" difficulty.</p>
            )}
        </div>
    );
};

export default CodingList;
