import { useState } from 'react';
import axios from 'axios';
import './styles/AptitudeList.css'; // Import the CSS file
import { jwtDecode } from 'jwt-decode';

const AptitudeQuestions = () => {
    const [categories, setCategories] = useState(['easy', 'medium', 'hard']);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clickedAnswers, setClickedAnswers] = useState({});
    const [score, setScore] = useState({ easy: 0, medium: 0, hard: 0 });
    const [fadeIn, setFadeIn] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState(''); // Message content
    const [messageType, setMessageType] = useState(''); // Message style ('success' or 'error')
    const [explanation, setExplanation] = useState(''); // Explanation of the selected answer

    const fetchQuestions = async (category) => {
        if (questions.length > 0 && selectedCategory === category) return;

        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:8000/api/aptitude?difficulty=${category}`);
            setQuestions(res.data);
            setClickedAnswers({});
        } catch (err) {
            setError('Failed to load questions. Please check your connection or try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        if (selectedCategory === category) return;
        setSelectedCategory(category);
        fetchQuestions(category);

        setFadeIn(false);
        setTimeout(() => setFadeIn(true), 300);
    };

    const handleOptionClick = (questionId, optionIndex) => {
        setClickedAnswers((prev) => ({
            ...prev,
            [questionId]: optionIndex,
        }));
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        let userId = null;

        try {
            const decoded = jwtDecode(token);
            userId = decoded?.user?.id || null;
        } catch (err) {
            setMessage('Invalid token. Please log in again.');
            setMessageType('error');
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const selectedOptionIndex = clickedAnswers[currentQuestion._id];

        if (!userId) {
            setMessage('User not authenticated. Please log in.');
            setMessageType('error');
            return;
        }

        if (selectedOptionIndex === undefined) {
            setMessage('Please select an option before submitting.');
            setMessageType('error');
            return;
        }

        const selectedOption1 = currentQuestion.options[selectedOptionIndex];
        const isCorrect = selectedOption1.isCorrect;
        const selectedOption = selectedOption1.optionText;

        try {
            const questionId = currentQuestion._id;

            // Check if a submission exists for this user and question
            const response = await axios.get(`http://localhost:8000/api/aptitudeSubmissions?userId=${userId}&questionId=${questionId}`);

            if (response.data.length > 0) {
                // If a submission exists, show a message (no score update)
                setMessage('You have already submitted an answer for this question.');
                setMessageType('warning');
                return;
            }

            // If no previous submission, proceed with submission and score update
            await axios.post('http://localhost:8000/api/aptitudeSubmissions', {
                userId,
                questionId,
                selectedOption,
            });

            setMessage('Answer submitted successfully!');
            setMessageType('success');

            // Update score locally only once if the answer is correct
            if (isCorrect) {
                let newScore = { ...score };

                // Add score based on category
                if (selectedCategory === 'easy') {
                    newScore.easy += 2;
                } else if (selectedCategory === 'medium') {
                    newScore.medium += 4;
                } else if (selectedCategory === 'hard') {
                    newScore.hard += 8;
                }
                setScore(newScore);
            }

            // Fetch explanation from the question object
            setExplanation(currentQuestion.explanation);

        } catch (err) {
            setMessage('Failed to submit the answer. Please try again.');
            setMessageType('error');
        }

        setSubmitted(true);
    };

    const handleNext = () => {
        setSubmitted(false); // Reset submission state
        setMessage(''); // Clear message
        setMessageType(''); // Clear message type
        setExplanation(''); // Clear explanation
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length); // Loop through questions
    };
    
    const handlePrevious = () => {
        setSubmitted(false); // Reset submission state
        setMessage(''); // Clear message
        setMessageType(''); // Clear message type
        setExplanation(''); // Clear explanation
        setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length); // Loop through questions
    };

    return (
        <div className="aptitude-container page-container">
            <h2>Aptitude Questions</h2>

            {/* Categories Section */}
            <div className="categories">
                <h3>Choose a Difficulty Level</h3>
                <ul>
                    {categories.map((category) => (
                        <li key={category}>
                            <button
                                onClick={() => handleCategoryClick(category)}
                                className={selectedCategory === category ? 'selected' : ''}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        </li>
                    ))}
                </ul>

            </div>

            {/* Message Section */}
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            {/* Questions Section */}
            <div className="question-section">
                {loading ? (
                    <p>Loading questions...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : selectedCategory && questions.length > 0 ? (
                    <>
                        <h3>Question {currentQuestionIndex + 1}</h3>
                        <h4>{questions[currentQuestionIndex]?.questionText}</h4>
                        {/* Explanation Section */}
                        {submitted && explanation && (
                            <div className="explanation">
                                {/* <h4>Explanation:</h4> */}
                                <p>Explanation: {explanation}</p>
                            </div>
                        )}
                        <div className="options-container">
                            {questions[currentQuestionIndex].options.map((option, index) => {
                                const isSelected = clickedAnswers[questions[currentQuestionIndex]._id] === index;
                                const isCorrect = submitted && option.isCorrect;
                                const isIncorrect = submitted && isSelected && !option.isCorrect;

                                return (
                                    <button
                                        key={index}
                                        className={`option-button ${
                                            isSelected ? 'selected' : ''
                                        } ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                                        onClick={() => handleOptionClick(questions[currentQuestionIndex]._id, index)}
                                        disabled={submitted} // Disable buttons after submission
                                    >
                                        {option.optionText}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="button-container">
                            <button onClick={handlePrevious}>Previous</button>
                            <button onClick={handleSubmit}>Submit</button>
                            <button onClick={handleNext}>Next</button>
                        </div>

                        
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
