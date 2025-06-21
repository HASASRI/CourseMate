import React, { useState, useEffect } from 'react';
import './Placement.css';
import { API_URL } from '../config';

const Placement = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchPlacementResources = async () => {
      try {
        const response = await fetch(`${API_URL}/api/placement-resources`);
        if (!response.ok) {
          throw new Error('Failed to fetch placement resources');
        }
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error('Error fetching placement resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlacementResources();
  }, []);
  
  const filteredResources = resources.filter(resource => 
    resource.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="placement-page">
       <div className="placement-banner">
        <img 
          src="/placement.png" 
          alt="Placement Resources Banner" 
          className="banner-image"
        />
      </div>
      <div className="placement-header">
        <h1>Placement Resources</h1>
        <p>Access company-specific interview preparation materials to boost your chances of success</p>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {isLoading ? (
        <div className="loading">Loading placement resources...</div>
      ) : (
        <div className="resources-container">
          {filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <div key={resource.id} className="resource-card">
                <h3>{resource.company}</h3>
                <p>Interview preparation materials</p>
                <a 
                  href={resource.resource_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Download PDF
                </a>
              </div>
            ))
          ) : (
            <div className="no-resources">
              No resources found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
      
      <div className="placement-tips">
        <h2>Interview Preparation Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>Technical Preparation</h3>
            <ul>
              <li>Review core CS concepts</li>
              <li>Practice coding problems daily</li>
              <li>Understand company-specific technologies</li>
              <li>Review past projects you've worked on</li>
            </ul>
          </div>
          <div className="tip-card">
            <h3>HR Interview Tips</h3>
            <ul>
              <li>Research the company thoroughly</li>
              <li>Prepare your introduction concisely</li>
              <li>Practice common HR questions</li>
              <li>Prepare questions to ask the interviewer</li>
            </ul>
          </div>
          <div className="tip-card">
            <h3>On Interview Day</h3>
            <ul>
              <li>Arrive early or log in early (virtual)</li>
              <li>Dress professionally</li>
              <li>Bring copies of your resume</li>
              <li>Be confident and authentic</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placement;