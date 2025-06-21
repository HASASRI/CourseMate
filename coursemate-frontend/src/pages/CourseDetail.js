import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CourseDetail.css';
import { API_URL } from '../config';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/courses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!course) return;
      
      setQuizLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/quizzes/course/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data);
        } else if (response.status !== 404) {
          // Only throw error if it's not a 404 (no quiz found is OK)
          throw new Error('Failed to fetch quiz data');
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        // We don't set the main error state here to avoid disrupting the course display
      } finally {
        setQuizLoading(false);
      }
    };

    fetchQuizData();
  }, [course, id]);

  if (isLoading) {
    return <div className="loading">Loading course details...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!course) {
    return <div className="not-found">Course not found</div>;
  }

  // Function to safely render video URL
  const renderVideoEmbed = () => {
    if (!course.intro_video) {
      return <div className="no-video">No introduction video available</div>;
    }

    let videoUrl = course.intro_video;
    
    // Handle YouTube URLs properly
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.split('/').pop().split('?')[0];
      videoUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
      <div className="video-container">
        <iframe
          src={videoUrl}
          title={`${course.title} Introduction Video`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const renderQuizSection = () => {
    if (quizLoading) {
      return (
        <div className="quiz-section">
          <h2>Test Your Knowledge</h2>
          <p>Loading quiz information...</p>
        </div>
      );
    }

    // Check if quiz has external link
    if (quiz && quiz.external_link) {
      return (
        <div className="quiz-section">
          <h2>Test Your Knowledge</h2>
          <a href={quiz.external_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Take Course Quiz
          </a>
        </div>
      );
    }

    // Fallback for courses without quizzes or with internal quizzes
    return (
      <div className="quiz-section">
        <h2>Test Your Knowledge</h2>
        {quiz ? (
          <a href={`/quiz/${course.id}`} className="btn btn-primary">
            Take Course Quiz
          </a>
        ) : (
          <p>No quiz available for this course yet.</p>
        )}
      </div>
    );
  };

  return (
    <div className="course-detail-page">
      <div className="course-header">
        <h1>{course.title}</h1>
        <div className="course-category">{course.category}</div>
      </div>

      <div className="course-content">
        <div className="course-info">
          <div className="course-description">
            <h2>About this course</h2>
            <p>{course.description}</p>
          </div>
          
          {renderVideoEmbed()}

          <div className="resources-section">
            <h2>Learning Resources</h2>
            
            {course.free_resources && course.free_resources.length > 0 && (
              <div className="resource-group">
                <h3>Free Resources</h3>
                <ul className="resource-list">
                  {course.free_resources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.paid_resources && course.paid_resources.length > 0 && (
              <div className="resource-group">
                <h3>Premium Resources</h3>
                <ul className="resource-list">
                  {course.paid_resources.map((resource, index) => (
                    <li key={index}>
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        {resource.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {renderQuizSection()}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;