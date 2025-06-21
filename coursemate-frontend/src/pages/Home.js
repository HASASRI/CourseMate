import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedCourses from '../components/FeaturedCourses';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>CourseMate</h1>
          <h2>The Learning and Placement Material Companion</h2>
          <p>Your one-stop solution for quality learning resources and placement preparation materials</p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
            <Link to="/placement" className="btn btn-secondary">Placement Materials</Link>
          </div>
        </div>
      </div>
      
      <section className="features-section">
        <h2>Why Choose CourseMate?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Curated Resources</h3>
            <p>Hand-picked learning materials from trusted sources</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Skill Assessment</h3>
            <p>Test your knowledge with topic-specific quizzes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Placement Prep</h3>
            <p>Company-specific interview preparation materials</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Easy Navigation</h3>
            <p>Find exactly what you need without the overwhelm</p>
          </div>
        </div>
      </section>
      
      <FeaturedCourses />
      
      <section className="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>Explore our comprehensive collection of courses and resources</p>
        <Link to="/courses" className="btn btn-outline">Browse All Courses</Link>
      </section>
    </div>
  );
};

export default Home;