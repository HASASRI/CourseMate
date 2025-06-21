import React from "react";
import "./Footer.css"; // Importing CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>CourseMate</h2>
          <p>"The Learning and Placement Material Companion"</p>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/courses">Courses</a>
          <a href="/placement">Placement</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CourseMate. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
