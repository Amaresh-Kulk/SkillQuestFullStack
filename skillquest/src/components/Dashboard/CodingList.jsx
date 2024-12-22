// components/Dashboard/CodingList.jsx

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

    try {
      const response = await axios.post(`http://localhost:5000/api/run`, {
        code: selectedQuestion.solution,
        testCases: selectedQuestion.testCases, // Assuming test cases are part of the question
        language: 'javascript', // Adjust based on the language you're using
      });

      setExecutionResult(response.data); // Set the result of code execution
    } catch (err) {
      console.error('Error executing code:', err);
      setExecutionResult({ error: 'Failed to execute the code. Please try again.' });
    }
  };

  return (
    <div>
      <h2>Coding Questions</h2>

      {/* Difficulty Selector */}
      <div>
        <h3>Select Difficulty:</h3>
        <ul
          style={{
            display: 'flex',
            gap: '10px',
            listStyle: 'none',
            padding: 0,
            justifyContent: 'center',
          }}
        >
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
                  fontSize: '14px',
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

              {/* Select Question for Editing */}
              <button
                onClick={() => handleSelectQuestion(question)}
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
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
                    style={{
                      display: 'block',
                      marginTop: '10px',
                      width: '100%',
                    }}
                  />

                  <button
                    onClick={handleExecuteCode}
                    style={{
                      marginTop: '10px',
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Execute Code
                  </button>

                  {/* Display Execution Results */}
                  {executionResult && (
                    <div
                      style={{
                        marginTop: '10px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                      }}
                    >
                      <h4>Execution Results:</h4>
                      {executionResult.error ? (
                        <p style={{ color: 'red' }}>{executionResult.error}</p>
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
        <p>No coding questions available for "{selectedDifficulty}" difficulty.</p>
      )}
    </div>
  );
};

export default CodingList;
