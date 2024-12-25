import { useEffect, useState } from 'react';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';

const CodingList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [predefinedMainFunction, setPredefinedMainFunction] = useState('');
  const difficulties = ['easy', 'medium', 'hard'];

  // Fetch the predefined main function
  useEffect(() => {
    const fetchMainFunction = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/mainFunctions');
        setPredefinedMainFunction(res.data);
      } catch (err) {
        console.error('Error fetching predefined main function:', err);
        setError('Failed to load the predefined main function.');
      }
    };
    fetchMainFunction();
  }, []);

  const fetchQuestions = async (difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/coding?difficulty=${difficulty}`);
      setQuestions(res.data || []);
    } catch (err) {
      console.error('Error fetching coding questions:', err);
      setError('Failed to load coding questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(selectedDifficulty);
  }, [selectedDifficulty]);

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setExecutionResult(null);
  };

  const handleCodeChange = (newCode) => {
    if (selectedQuestion) {
      setSelectedQuestion((prevQuestion) => ({
        ...prevQuestion,
        solution: newCode,
      }));
    }
  };

  const handleExecuteCode = async () => {
    if (!selectedQuestion || !predefinedMainFunction) return;

    const userCode = selectedQuestion.solution;
    const testCases = selectedQuestion.testCases;

    const fullCode = `
      ${userCode}
      ${predefinedMainFunction}
      const testCases = ${JSON.stringify(testCases)};
      const userFunction = ${selectedQuestion.functionName}; // Replace with function name
      runTestCases(userFunction, testCases);
    `;

    try {
      const response = await axios.post(`http://localhost:8000/api/runcode/run`, {
        code: fullCode,
        language: 'javascript',
      });

      setExecutionResult(response.data);
    } catch (err) {
      console.error('Error executing code:', err);
      setExecutionResult({ error: 'Failed to execute the code. Please try again.' });
    }
  };

  return (
    <div className="coding-list-container">
      <h2 className="page-title">Coding Questions</h2>

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

      {loading ? (
        <p>Loading coding questions...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : questions.length > 0 ? (
        <div className="coding-content">
          {/* Question List on the left */}
          <div className="question-list">
            {questions.map((question) => (
              <div key={question._id} className="question-card">
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
                <button onClick={() => handleSelectQuestion(question)} className="edit-button">
                  Edit Solution
                </button>
              </div>
            ))}
          </div>

          {/* Monaco Editor on the right */}
          {selectedQuestion && (
            <div className="editor-container">
              <div className="editor-section">
                <MonacoEditor
                  value={selectedQuestion.solution || ''}
                  onChange={handleCodeChange}
                  language="javascript"
                  theme="vs-dark"
                  height="400px"
                  options={{ selectOnLineNumbers: true, minimap: { enabled: false } }}
                />
                <button onClick={handleExecuteCode} className="execute-button">
                  Execute Code
                </button>
              </div>
              {executionResult && (
                <div className="execution-results">
                  <h4>Execution Results:</h4>
                  {executionResult.error ? (
                    <p className="error-message">{executionResult.error}</p>
                  ) : (
                    executionResult.map((result, index) => (
                      <div key={index}>
                        <p><strong>Test Case {index + 1}:</strong></p>
                        <p><strong>Input:</strong> {result.input}</p>
                        <p><strong>Expected Output:</strong> {result.expectedOutput}</p>
                        <p><strong>Your Output:</strong> {result.actualOutput}</p>
                        <p><strong>Status:</strong> {result.passed ? 'Passed' : 'Failed'}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p className="no-questions-message">No coding questions available for "{selectedDifficulty}" difficulty.</p>
      )}
    </div>
  );
};

export default CodingList;
