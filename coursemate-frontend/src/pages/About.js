import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
       <div className="about-banner">
        <img 
          src="/about.png" 
          alt="About CourseMate Banner" 
          className="banner-image"
        />
      </div>
      <div className="about-header">
        <h1>About CourseMate</h1>
        <p>The Learning and Placement Material Companion</p>
      </div>
      
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          CourseMate is an innovative online platform designed to empower students, especially freshers and those new to the world of Computer Science, by providing easy access to quality learning resources and placement preparation materials. As many students are unsure where to start or which resources to trust, CourseMate bridges this gap by offering a one-stop solution for learning, quiz assessments, and job placement preparation.
        </p>
      </section>
      
      <section className="about-section">
        <h2>Who We Serve</h2>
        <p>
          The platform is specifically tailored to help students who are just beginning their journey in Computer Science or those who are looking to enhance their skills for career success. Freshers and master's students will find it particularly valuable as it provides a curated list of relevant courses, instructional videos, and quizzes designed to test and improve their knowledge.
        </p>
      </section>
      
      <section className="about-section">
        <h2>Our Approach</h2>
        <p>
          Each course is accompanied by detailed descriptions, quiz sections, and links to platforms offering additional free or paid resources, making it easier for students to navigate the overwhelming world of online learning. Moreover, CourseMate's Placement Materials Page provides crucial interview preparation resources. Students can access company-specific interview PDFs, improving their chances of securing a job by gaining knowledge of the specific requirements and formats used by different organizations.
        </p>
      </section>
      
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          With an easy-to-navigate interface, CourseMate ensures that students at any level—whether they're just starting or preparing for their first job interview—can take full advantage of the learning materials, resources, and tools available to them. By simplifying the search for courses and placement materials, CourseMate allows students to focus more on learning and less on the chaos of finding the right information.
        </p>
      </section>
      
      <section className="team-section">
        <h2>Project Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <h3>Chaganti Jahnavi</h3>
            <p>21X41A0508</p>
          </div>
          <div className="team-member">
            <h3>Chintha Hasa Sri</h3>
            <p>21X41A0510</p>
          </div>
          <div className="team-member">
            <h3>Ajjarapu Sowmya</h3>
            <p>21X41A0502</p>
          </div>
          <div className="team-member">
            <h3>Nalluri Siva Naga Lakshmi</h3>
            <p>17X41A0598</p>
          </div>
        </div>
      </section>
      
      {/* Special Thanks Section */}
      <section className="special-thanks">
        <h2>Special Thanks</h2>
        <p>
        We would like to express our heartfelt gratitude to <strong>Dr. A. Radhika Ma’am </strong> 
        & <strong>Manikantha Sir </strong>for thier invaluable guidance and unwavering support throughout our project.<br></br>
        We also extend our sincere thanks to everyone who supported making this project a grand success.
        </p>
      </section>
    </div>
    
  );
};

export default About;
