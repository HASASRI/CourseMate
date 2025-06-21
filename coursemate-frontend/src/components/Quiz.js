import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({ courseId, apiService }) => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!quizStarted) return;
    
    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        // Mock quiz questions since we're not using axios
        const mockQuestions = [
          {
            question: "What is programming?",
            options: ["Creating software applications", "Fixing computers", "Designing websites", "Setting up networks"],
            correct_answer: "Creating software applications"
          },
          {
            question: "Which of the following is not a programming language?",
            options: ["Java", "Python", "HTML", "Microsoft Word"],
            correct_answer: "Microsoft Word"
          },
          {
            question: "What is an algorithm?",
            options: ["A programming language", "A step-by-step procedure to solve a problem", "A type of computer", "A mathematical equation"],
            correct_answer: "A step-by-step procedure to solve a problem"
          },
          {
            question: "What does CPU stand for?",
            options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Central Processor Utility"],
            correct_answer: "Central Processing Unit"
          },
          {
            question: "Which of the following is a data type?",
            options: ["Integer", "Function", "Loop", "Module"],
            correct_answer: "Integer"
          }
        ];
        
        setQuizQuestions(mockQuestions);
        setUserAnswers(new Array(mockQuestions.length).fill(null));
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz questions. Please try again later.');
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [courseId, quizStarted]);

  useEffect(() => {
    if (!quizStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(300);
    setShowResults(false);
    setUserAnswers([]);
    setQuizResults(null);
  };

  const handleAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      // Since we're not using axios, create a mock results calculation
      const results = quizQuestions.map((question, index) => {
        const userAnswer = userAnswers[index] || "No answer";
        return {
          question: question.question,
          user_answer: userAnswer,
          correct_answer: question.correct_answer,
          is_correct: userAnswer === question.correct_answer
        };
      });
      
      const correctCount = results.filter(result => result.is_correct).length;
      const score = (correctCount / quizQuestions.length) * 100;
      
      setQuizResults({
        score,
        correct_count: correctCount,
        total_questions: quizQuestions.length,
        results
      });
      
      setShowResults(true);
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <h2>Test Your Knowledge</h2>
        <p>This quiz will test your understanding of the course material. You'll have 5 minutes to complete all questions.</p>
        <div className="quiz-start-card">
          <img src="/assets/quiz-icon.svg" alt="Quiz" className="quiz-icon" />
          <h3>Ready to test your knowledge?</h3>
          <p>You'll have 5 minutes to answer all questions. Good luck!</p>
          <button className="start-quiz-btn" onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="quiz-loading">Loading quiz questions...</div>;
  }

  if (error) {
    return <div className="quiz-error">{error}</div>;
  }

  if (showResults) {
    return (
      <div className="quiz-results">
        <h2>Quiz Results</h2>
        <div className="score-card">
          <div className="score">
            <h3>Your Score: {quizResults.score.toFixed(2)}%</h3>
            <p>{quizResults.correct_count} out of {quizResults.total_questions} correct</p>
          </div>
          
          <div className="result-details">
            <h3>Question Summary:</h3>
            {quizResults.results.map((result, index) => (
              <div key={index} className={`result-item ${result.is_correct ? 'correct' : 'incorrect'}`}>
                <p><strong>Q{index + 1}:</strong> {result.question}</p>
                <p className="your-answer">Your answer: {result.user_answer}</p>
                {!result.is_correct && (
                  <p className="correct-answer">Correct answer: {result.correct_answer}</p>
                )}
              </div>
            ))}
          </div>
          
          <button className="retry-btn" onClick={handleStartQuiz}>Retry Quiz</button>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz</h2>
        <div className="quiz-timer">Time left: {formatTime(timeLeft)}</div>
      </div>
      
      <div className="quiz-progress">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(currentQuestion / quizQuestions.length) * 100}%` }}></div>
        </div>
        <div className="question-counter">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </div>
      </div>
      
      <div className="quiz-question">
        <h3>{currentQ.question}</h3>
        <div className="options">
          {currentQ.options.map((option, index) => (
            <div 
              key={index} 
              className={`option ${userAnswers[currentQuestion] === option ? 'selected' : ''}`}
              onClick={() => handleAnswer(option)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="quiz-navigation">
        <button 
          className="nav-btn prev" 
          onClick={handlePrevQuestion}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        {currentQuestion < quizQuestions.length - 1 ? (
          <button className="nav-btn next" onClick={handleNextQuestion}>
            Next
          </button>
        ) : (
          <button className="nav-btn submit" onClick={handleSubmitQuiz}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;