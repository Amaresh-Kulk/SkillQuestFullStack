import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import MonacoEditor from '@monaco-editor/react';
import './styles/CodingList.css';

const CodingList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [showHint, setShowHint] = useState(false); // State for showing the hint
  const difficulties = ['easy', 'medium', 'hard'];

  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.user?.id || null;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in. Please log in.');
      return;
    }

    if (selectedDifficulty) {
      setExecutionResult(null);
      setCode('');
      const fetchQuestions = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:8000/api/coding?difficulty=${selectedDifficulty}`);
          setQuestions(res.data || []);
          setCurrentQuestionIndex(0);
        } catch (err) {
          console.error('Failed to load questions:', err);
          setError('Failed to load coding questions.');
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [selectedDifficulty, userId]);

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleExecuteCode = async () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!userId || !currentQuestion || !code) {
      setExecutionResult('User not found or invalid code.');
      return;
    }

    setIsExecuting(true);
    try {
      const questionId = currentQuestion._id;
      const response = await axios.post('http://localhost:8000/api/runcode/run', {
        code,
        language,
        userId,
        questionId,
      });

      const { output } = response.data;

      setExecutionResult(`Execution Result:\nOutput: ${output || 'No output'}`);
    } catch (err) {
      console.error('Execution error:', err);
      setExecutionResult('Error executing the code.');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setExecutionResult(null);
    setCode('');
    setShowHint(false); // Reset hint visibility
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    setExecutionResult(null);
    setCode('');
    setShowHint(false); // Reset hint visibility
  };

  const handleShowHint = () => {
    setShowHint(!showHint); // Toggle the hint visibility
  };

  return (
    <div className="coding-list-container page-container">
      <h2 className="page-title">Top Interview Questions</h2>

      <div className="difficulty-selector">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className={`difficulty-button ${difficulty === selectedDifficulty ? 'selected' : ''}`}
            onClick={() => handleDifficultyClick(difficulty)}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </button>
        ))}
      </div>

      {selectedDifficulty && questions.length > 0 && (
        <div className="coding-content">
          <div className="question-list-container">
            <div className="question-card">
              <h3 className="question-title">{questions[currentQuestionIndex]?.questionText}</h3>
              <p className="question-category">
                <strong>Category:</strong> {questions[currentQuestionIndex]?.category}
              </p>
              <div className="question-description">
                <strong>Description:</strong>
                <p>{questions[currentQuestionIndex]?.description}</p>
              </div>
              {questions[currentQuestionIndex]?.example && (
                <div className="example-section">
                  <strong>Example:</strong>
                  <p><strong>Input:</strong> {questions[currentQuestionIndex]?.example.input}</p>
                  <p><strong>Output:</strong> {questions[currentQuestionIndex]?.example.output}</p>
                </div>
              )}
              <p className="question-constraint">
                <strong>Constraint:</strong> {questions[currentQuestionIndex]?.constraints}
              </p>
            </div>
            {/* Hint Button and Hint Section */}
            <button className="hint-button" onClick={handleShowHint}>
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && questions[currentQuestionIndex]?.solution && (
              <div className="hint-section">
                <strong>Solution Hint:</strong>
                <pre>{questions[currentQuestionIndex]?.solution}</pre>
              </div>
            )}
          </div>

          <div className="editor-container">
            <MonacoEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              theme="vs-dark"
              height="400px"
              options={{ selectOnLineNumbers: true, minimap: { enabled: false } }}
            />
            {executionResult && (
              <div className={`execution-result animate`}>
                <h4>Execution Result:</h4>
                <pre>{executionResult}</pre>
              </div>
            )}
            
          </div>
        </div>
      )}

      {selectedDifficulty && questions.length > 0 && (
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
            className={`navigation-button ${isExecuting ? 'executing' : ''}`}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing...' : 'Execute Code'}
          </button>
          <button
            onClick={handleNext}
            className="navigation-button"
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CodingList;
