import { useEffect, useState } from 'react';
import axios from 'axios';

const AptitudeQuestions = () => {
    const [categories, setCategories] = useState(['easy', 'medium', 'hard']);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clickedAnswers, setClickedAnswers] = useState({});
    const [score, setScore] = useState(0); // State to keep track of the score

    const fetchQuestions = async (category) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:8000/api/aptitude?difficulty=${category}`);
            setQuestions(res.data);
            setClickedAnswers({});
            setScore(0); // Reset score when category changes
        } catch (err) {
            console.error('Error fetching aptitude questions:', err);
            setError('Failed to load questions. Please check your connection or try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchQuestions(category);
    };

    const handleOptionClick = (questionId, optionIndex) => {
        // Prevent scoring the same question multiple times
        if (clickedAnswers[questionId] !== undefined) return;

        const question = questions.find((q) => q._id === questionId);
        const selectedOption = question.options[optionIndex];

        if (selectedOption.isCorrect) {
            const points =
                selectedCategory === 'easy' ? 2 : selectedCategory === 'medium' ? 4 : 8;
            setScore((prevScore) => prevScore + points);
        }

        setClickedAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    return (
        <div>
            <h2>Aptitude Questions</h2>

            {/* Categories Section */}
            <div>
                <h3>Choose a Difficulty Level</h3>
                <ul>
                    {categories.map((category) => (
                        <li key={category}>
                            <button onClick={() => handleCategoryClick(category)}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Questions Section */}
            <div>
                {loading ? (
                    <p>Loading questions...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : selectedCategory && questions.length > 0 ? (
                    <>
                        <h3>Questions for "{selectedCategory}" Difficulty</h3>
                        {questions.map((question) => (
                            <div key={question._id} style={{ marginBottom: '20px' }}>
                                <h4>{question.questionText}</h4>
                                <ul>
                                    {question.options.map((option, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                cursor: 'pointer',
                                                color:
                                                    clickedAnswers[question._id] === index
                                                        ? option.isCorrect
                                                            ? 'green'
                                                            : 'red'
                                                        : 'black',
                                            }}
                                            onClick={() => handleOptionClick(question._id, index)}
                                        >
                                            {option.optionText}{' '}
                                            {clickedAnswers[question._id] === index &&
                                                option.isCorrect && <strong>(Correct)</strong>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <h3>Total Score: {score}</h3>
                    </>
                ) : selectedCategory ? (
                    <p>No questions available for "{selectedCategory}" difficulty.</p>
                ) : (
                    <p>Please select a category to view questions.</p>
                )}
            </div>
        </div>
    );
};

export default AptitudeQuestions;
