import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Courses.css';
import { API_URL } from '../config';

const Courses = () => {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const url = selectedCategory 
          ? `${API_URL}/api/courses?category=${encodeURIComponent(selectedCategory)}`
          : `${API_URL}/api/courses`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [selectedCategory]);
  
  return (
    <div className="courses-page">
        <div className="courses-banner">
        <img 
          src="/Welcome Explore Courses.png" 
          alt="Explore Courses Banner" 
          className="banner-image"
        />
      </div>
      <div className="courses-header">
        <h1>Explore Courses</h1>
        <p>Discover learning resources for various computer science and technology subjects</p>
      </div>
      
      <div className="courses-filter">
        <div className="category-filter">
          <h3>Categories</h3>
          <ul className="category-list">
            <li 
              className={selectedCategory === '' ? 'active' : ''}
              onClick={() => setSelectedCategory('')}
            >
              All Courses
            </li>
            {categories.map((category, index) => (
              <li 
                key={index}
                className={selectedCategory === category ? 'active' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="courses-grid">
          {isLoading ? (
            <div className="loading">Loading courses...</div>
          ) : (
            <>
              {courses.length > 0 ? (
                courses.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-card-content">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <Link to={`/courses/${course.id}`} className="btn btn-primary">View Details</Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-courses">No courses found in this category.</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
