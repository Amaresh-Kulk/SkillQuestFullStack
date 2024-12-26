import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';
import './styles/CodingList.css';

const CodingList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [executionResult, setExecutionResult] = useState(null);
  const [code, setCode] = useState('');
  const difficulties = ['easy', 'medium', 'hard'];

  // Retrieve and decode token to get userId
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded?.user?.id || null;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in. Please log in.');
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/coding?difficulty=${selectedDifficulty}`);
        setQuestions(res.data || []);
        setCurrentQuestionIndex(0); // Reset to the first question
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError('Failed to load coding questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [selectedDifficulty, userId]);

  const handleExecuteCode = async () => {
    const currentQuestion = questions[currentQuestionIndex];
  
    if (!userId || !currentQuestion || !code) {
      setExecutionResult('User not found or invalid code.');
      return;
    }
  
    try {
      const question_id = currentQuestion._id;
      const response = await axios.post('http://localhost:8000/api/runcode/run', {
        question_id,
        code,
        userId
      });
  
      console.log("Execution Response: ", response.data);
  
      const { passedCount, totalTestCases, results, score, success } = response.data;
  
      if (success) {
        setExecutionResult(`
          Execution Result:
          Test Cases Passed: ${passedCount}/${totalTestCases}
          Score: ${score}
          Output: ${results[0]?.output || 'No output'}
        `);
      } else {
        setExecutionResult(`
          Execution Failed:
          Error: ${results[0]?.error || 'Unknown error'}
        `);
      }
  
    } catch (err) {
      console.error("Execution error:", err);
      setExecutionResult('Error executing the code.');
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  return (
    <div className="coding-list-container">
      <h2 className="page-title">Coding Questions</h2>

      <div className="difficulty-selector">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className={`difficulty-button ${difficulty === selectedDifficulty ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading coding questions...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="coding-content">
          <div className="question-list-container">
            <div className="question-card">
              <h3>{questions[currentQuestionIndex]?.questionText}</h3>
              <p><strong>Category:</strong> {questions[currentQuestionIndex]?.category}</p>
              <p><strong>Difficulty:</strong> {questions[currentQuestionIndex]?.difficulty}</p>
              <p><strong>Description:</strong> {questions[currentQuestionIndex]?.description}</p>
              {questions[currentQuestionIndex]?.example && (
                <div>
                  <strong>Example:</strong>
                  <p><strong>Input:</strong> {questions[currentQuestionIndex]?.example.input}</p>
                  <p><strong>Output:</strong> {questions[currentQuestionIndex]?.example.output}</p>
                </div>
              )}
            </div>
          </div>

          <div className="editor-container">
            <MonacoEditor
              value={code}
              onChange={handleCodeChange}
              language="javascript"
              theme="vs-dark"
              height="400px"
              options={{ selectOnLineNumbers: true, minimap: { enabled: false } }}
            />
          </div>
        </div>
      )}

      {executionResult && (
        <div className="execution-result">
          <h4>Execution Result:</h4>
          <pre>{executionResult}</pre>
        </div>
      )}

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          className="navigation-button"
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={handleExecuteCode}
          className="navigation-button"
        >
          Execute Code
        </button>
        <button
          onClick={handleNext}
          className="navigation-button"
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CodingList;
