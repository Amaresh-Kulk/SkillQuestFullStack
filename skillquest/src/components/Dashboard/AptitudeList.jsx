import { useState } from 'react';
import axios from 'axios';
import './styles/AptitudeList.css'; // Import the CSS file

const AptitudeQuestions = () => {
    const [categories, setCategories] = useState(['easy', 'medium', 'hard']);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clickedAnswers, setClickedAnswers] = useState({}); // Track answers for each question
    const [score, setScore] = useState({ easy: 0, medium: 0, hard: 0 }); // Track score for each difficulty level
    const [fadeIn, setFadeIn] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
    const [submitted, setSubmitted] = useState(false); // Track if the answer has been submitted

    const fetchQuestions = async (category) => {
        if (questions.length > 0 && selectedCategory === category) return; // Do not fetch if questions are already loaded for the category
    
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:8000/api/aptitude?difficulty=${category}`);
            setQuestions(res.data);
            setClickedAnswers({});
        } catch (err) {
            console.error('Error fetching aptitude questions:', err);
            setError('Failed to load questions. Please check your connection or try again later.');
        } finally {
            setLoading(false);
        }
    };
    

    const handleCategoryClick = (category) => {
        if (selectedCategory === category) return; // Prevent re-fetching if same category is clicked
        setSelectedCategory(category);
        fetchQuestions(category);
        
        setFadeIn(false); // Start fade-out
        setTimeout(() => {
            setFadeIn(true); // Start fade-in after content is updated
        }, 300); // Duration of fade-out transition
    };

    const handleOptionClick = (questionId, optionIndex) => {
        // Toggle option selection for multiple selections
        setClickedAnswers((prev) => {
            const selectedOptions = prev[questionId] || [];
            if (selectedOptions.includes(optionIndex)) {
                // If already selected, unselect it
                return {
                    ...prev,
                    [questionId]: selectedOptions.filter((index) => index !== optionIndex),
                };
            } else {
                // Otherwise, select the option
                return {
                    ...prev,
                    [questionId]: [...selectedOptions, optionIndex],
                };
            }
        });
    };

    const handleSubmit = () => {
        let newScore = { ...score };
        // Only update the score once when the submit button is clicked
        if (!submitted) {
            questions[currentQuestionIndex].options.forEach((option, index) => {
                if (clickedAnswers[questions[currentQuestionIndex]._id]?.includes(index)) {
                    // Update score based on the selected option
                    if (option.isCorrect) {
                        if (selectedCategory === 'easy') {
                            newScore.easy += 2;
                        } else if (selectedCategory === 'medium') {
                            newScore.medium += 4;
                        } else if (selectedCategory === 'hard') {
                            newScore.hard += 8;
                        }
                    }
                }
            });
            setScore(newScore);
        }

        setSubmitted(true); // Set submitted to true to prevent further changes
    };

    const handleNext = () => {
        setSubmitted(false); // Reset submission state when moving to next question
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length); // Loop through questions
    };

    const handlePrevious = () => {
        setSubmitted(false); // Reset submission state when moving to previous question
        setCurrentQuestionIndex((prevIndex) => (prevIndex - 1 + questions.length) % questions.length); // Loop through questions
    };

    const totalScore = score.easy + score.medium + score.hard; // Calculate total score

    return (
        <div className="aptitude-container">
            <h2>Aptitude Questions</h2>

            {/* Categories Section */}
            <div className="categories">
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
            <div className="question-section">
                {loading ? (
                    <p>Loading questions...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : selectedCategory && questions.length > 0 ? (
                    <>
                        <h3>Question {currentQuestionIndex + 1}</h3>
                        {/* Ensure that the question exists before rendering */}
                        <h4>
                            {questions[currentQuestionIndex] ? questions[currentQuestionIndex].questionText : 'Loading question...'}
                        </h4>
                        <div className="options-container">
                            {questions[currentQuestionIndex].options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-button ${
                                        clickedAnswers[questions[currentQuestionIndex]._id]?.includes(index) ? 'selected' : ''
                                    } ${
                                        submitted && option.isCorrect ? 'correct' : ''
                                    }`}
                                    onClick={() =>
                                        handleOptionClick(questions[currentQuestionIndex]._id, index)
                                    }
                                >
                                    {option.optionText}
                                </button>
                            ))}
                        </div>
                        {/* Submit and Navigation Buttons */}
                        <div className="button-container">
                            <button onClick={handlePrevious}>Previous</button>
                            <button onClick={handleSubmit}>Submit</button>
                            <button onClick={handleNext}>Next</button>
                        </div>
                        {/* Show Scores for Different Difficulty Levels */}
                        <h3 className="total-score">
                            Total Score: {totalScore} (Easy: {score.easy}, Medium: {score.medium}, Hard: {score.hard})
                        </h3>
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
