import { useEffect, useState } from 'react';
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
  const [predefinedMainFunction, setPredefinedMainFunction] = useState('');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const difficulties = ['easy', 'medium', 'hard'];

  // Difficulty marks
  const difficultyMarks = {
    easy: 2,
    medium: 4,
    hard: 8,
  };

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
      setCurrentQuestionIndex(0); // Reset to the first question
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

  const handleCodeChange = (newCode) => {
    if (questions[currentQuestionIndex]) {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].solution = newCode;
      setQuestions(updatedQuestions);
    }
  };

  const handleExecuteCode = async () => {
    if (!questions[currentQuestionIndex] || !predefinedMainFunction) return;

    const currentQuestion = questions[currentQuestionIndex];
    const userCode = currentQuestion.solution;
    const testCases = currentQuestion.testCases;

    const fullCode = `
      ${userCode}
      ${predefinedMainFunction}
      const testCases = ${JSON.stringify(testCases)};
      const userFunction = ${currentQuestion.functionName}; // Replace with function name
      runTestCases(userFunction, testCases);
    `;

    try {
      const response = await axios.post(`http://localhost:8000/api/runcode/run`, {
        code: fullCode,
        language: 'javascript',
      });

      // Compare the output with test cases
      const testResults = response.data;
      setExecutionResult(testResults);

      // Calculate score
      const questionDifficulty = currentQuestion.difficulty;
      const currentScore = difficultyMarks[questionDifficulty];
      setScore(currentScore);
      setTotalScore((prevScore) => prevScore + currentScore);
    } catch (err) {
      console.error('Error executing code:', err);
      setExecutionResult({ error: 'Failed to execute the code. Please try again.' });
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="coding-list-container">
      <h2 className="page-title">Coding Questions</h2>

      <div className="difficulty-selector">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty}
            className={`difficulty-button ${difficulty === selectedDifficulty ? 'active' : ''}`}
            onClick={() => handleDifficultyChange(difficulty)}
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
              <h3>{currentQuestion?.questionText}</h3>
              <p><strong>Category:</strong> {currentQuestion?.category}</p>
              <p><strong>Difficulty:</strong> {currentQuestion?.difficulty}</p>
              <p><strong>Constraints:</strong> {currentQuestion?.constraints}</p>
              <h4>Example</h4>
              {currentQuestion?.example && (
                <>
                  <p><strong>Input:</strong> {currentQuestion.example.input}</p>
                  <p><strong>Output:</strong> {currentQuestion.example.output}</p>
                </>
              )}
            </div>
          </div>

          <div className="editor-container">
            <MonacoEditor
              value={currentQuestion?.solution || ''}
              onChange={handleCodeChange}
              language="javascript"
              theme="vs-dark"
              height="400px"
              options={{ selectOnLineNumbers: true, minimap: { enabled: false } }}
            />
            {/* <button onClick={handleExecuteCode} className="execute-button">
              Execute Code
            </button> */}
          </div>
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

      <div className="score-container">
        <p><strong>Score for this question:</strong> {score}</p>
        <p><strong>Total Score:</strong> {totalScore}</p>
      </div>
    </div>
  );
};

export default CodingList;
