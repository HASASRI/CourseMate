import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedCourses.css';
import { API_URL } from '../config';
	
const FeaturedCourses = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses?category=Popular%20Courses`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setFeaturedCourses(data);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedCourses();
  }, []);
  
  if (isLoading) {
    return <div className="loading">Loading featured courses...</div>;
  }
  
  return (
    <section className="featured-courses">
      <h2>Popular Courses</h2>
      <div className="courses-grid">
        {featuredCourses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-card-content">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <Link to={`/courses/${course.id}`} className="btn btn-outline">View Details</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="view-all">
        <Link to="/courses" className="link-arrow">View All Courses</Link>
      </div>
    </section>
  );
};

export default FeaturedCourses;

