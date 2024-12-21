import { useEffect, useState } from 'react';
import axios from 'axios';

const QuestionList = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/questions?category=aptitude&difficulty=easy');
                setQuestions(res.data); // Ensure res.data is an array of question objects
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to load questions. Please check your connection or try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <p>Loading questions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Questions</h2>
            {questions.length > 0 ? (
                questions.map((question) => (
                    <div key={question._id}>
                        <h3>{question.questionText}</h3>
                        <ul>
                            {question.options && question.options.map((option, index) => (
                                <li key={index}>{option}</li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No questions available at the moment.</p>
            )}
        </div>
    );
};

export default QuestionList;
