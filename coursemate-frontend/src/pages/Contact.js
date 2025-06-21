import React from 'react';
import './Contact.css'; // Create this CSS file for styling

const Contact = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Jahnavi Chowdary',
      email: 'jahnavichaganti2003@gmail.com',
    }, 
     {
        id: 2,
        name: 'Hasa Sri Chintha',
        email: 'srihasaraji14@gmail.com',
      }, 
       {
        id: 3,
        name: 'Sowmya Ajjarapu',
        email: 'ajjarapusowmya816@gmail.com',
      }, 
       {
        id: 4,
        name: 'Siva Naga Lakshmi Nalluri',
        email: 'nalluri.lakshmi09@gmail.com',
      }
  ];

  return (
    <div className="contact-container">
      <h1>Our Team</h1>
      <p className="team-description">
        Get in touch with our dedicated team members who are ready to assist you.
      </p>
      
      <div className="team-members">
        {teamMembers.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-info">
              <h3>{member.name}</h3>
              <p className="contact-info">
                <strong>Email:</strong> {member.email}<br />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;