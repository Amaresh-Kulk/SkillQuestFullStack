import { useEffect, useState } from 'react';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react'; // Import MonacoEditor

const CodingList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium'); // Default category
  const [selectedQuestion, setSelectedQuestion] = useState(null); // To store selected question for editing
  const [executionResult, setExecutionResult] = useState(null); // To store code execution results
  const difficulties = ['easy', 'medium', 'hard'];

  // Fetch questions based on selected difficulty
  const fetchQuestions = async (difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/coding?difficulty=${difficulty}`);
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

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question); // Set the selected question to show in Monaco Editor
    setExecutionResult(null); // Clear previous results when selecting a new question
  };

  const handleCodeChange = (newCode) => {
    if (selectedQuestion) {
      setSelectedQuestion((prevQuestion) => ({
        ...prevQuestion,
        solution: newCode, // Update solution as code is changed
      }));
    }
  };

  const handleExecuteCode = async () => {
    if (!selectedQuestion) return;

    const userId = "67669f5948033ab9676ddb19"; // Replace with the actual userId (e.g., from the logged-in user)
    const questionId = selectedQuestion._id; // Use the selected question's ID
    try {
      const response = await axios.post(`http://localhost:8000/api/runcode/run`, {
        code: selectedQuestion.solution,
        testCases: selectedQuestion.testCases, // Assuming test cases are part of the question
        language: 'javascript', // Adjust based on the language you're using
        userId, // Include userId
        questionId, // Include questionId
      });

      setExecutionResult(response.data); // Set the result of code execution
    } catch (err) {
      console.error('Error executing code:', err);
      setExecutionResult({ error: 'Failed to execute the code. Please try again.' });
    }
  };

  return (
    <div className="coding-list-container">
      <h2 className="page-title">Coding Questions</h2>

      {/* Difficulty Selector */}
      <div className="difficulty-selector">
        <h3>Select Difficulty:</h3>
        <ul className="difficulty-list">
          {difficulties.map((difficulty) => (
            <li key={difficulty}>
              <button
                className={`difficulty-button ${difficulty === selectedDifficulty ? 'active' : ''}`}
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
        <p className="loading-text">Loading coding questions...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : questions.length > 0 ? (
        <div className="questions-container">
          {questions.map((question) => (
            <div
              key={question._id}
              className="question-card"
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

              {/* Select Question for Editing */}
              <button
                onClick={() => handleSelectQuestion(question)}
                className="edit-button"
              >
                Edit Solution
              </button>

              {/* Show Monaco Editor and Execute Button for Selected Question */}
              {selectedQuestion && selectedQuestion._id === question._id && (
                <>
                  <MonacoEditor
                    value={selectedQuestion.solution || ''}
                    onChange={handleCodeChange}
                    language="javascript"
                    theme="vs-dark"
                    height="400px"
                    options={{
                      selectOnLineNumbers: true,
                      minimap: { enabled: false },
                    }}
                    className="monaco-editor"
                  />

                  <button
                    onClick={handleExecuteCode}
                    className="execute-button"
                  >
                    Execute Code
                  </button>

                  {/* Display Execution Results */}
                  {executionResult && (
                    <div className="execution-results">
                      <h4>Execution Results:</h4>
                      {executionResult.error ? (
                        <p className="error-message">{executionResult.error}</p>
                      ) : (
                        <pre>{JSON.stringify(executionResult, null, 2)}</pre>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-questions-message">No coding questions available for "{selectedDifficulty}" difficulty.</p>
      )}
    </div>
  );
};

export default CodingList;
