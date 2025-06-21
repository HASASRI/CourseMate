// src/pages/CourseQuiz.js
import React from 'react';

const CourseQuiz = ({ courseId, courseTitle }) => {
  // Map course IDs to their respective Google Form links
  const quizLinks = {
    1: "https://docs.google.com/forms/d/e/1FAIpQLSe7gJTgcZi8q1mGcF-RhlupyrdyvJFgvFf7OJnAyQwfkzvZrQ/viewform"
    // Add more course quiz links as needed for other courses
  };
  
  const handleStartQuiz = () => {
    const quizLink = quizLinks[courseId];
    if (quizLink) {
      window.open(quizLink, '_blank');
    } else {
      alert("Quiz for this course is not available yet.");
    }
  };

  return (
    <div className="course-quiz">
      <h2>Test Your Knowledge</h2>
      
      {quizLinks[courseId] ? (
        <>
          <p>Take a quiz to test your understanding of {courseTitle}.</p>
          <div className="quiz-icon">
            <img src="/quiz-icon.png" alt="Quiz" />
          </div>
          <p>Ready to challenge yourself? Click the button below to start the quiz!</p>
          <button className="btn btn-primary" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </>
      ) : (
        <>
          <p>Quiz feature coming soon! This section will contain interactive quizzes to help you test and reinforce your learning.</p>
          <div className="quiz-icon">
            <img src="/quiz-icon.png" alt="Quiz" />
          </div>
          <p>We're working on creating engaging quizzes for this course.</p>
          <button className="btn btn-secondary" disabled>
            Start Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default CourseQuiz;