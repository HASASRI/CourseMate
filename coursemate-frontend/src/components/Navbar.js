import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Add this import
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Replace local storage check
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  // Toggle dark mode (keep this unchanged)
  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  // Updated handleLogout using AuthContext
  const handleLogout = () => {
    logout(); // Use AuthContext's logout instead of direct localStorage
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">CourseMate</Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        {currentUser && ( // Only show protected links if logged in
          <>
            <li className={location.pathname.includes("/courses") ? "active" : ""}>
              <Link to="/courses">Courses</Link>
            </li>
            <li className={location.pathname === "/placement" ? "active" : ""}>
              <Link to="/placement">Placement</Link>
            </li>
          </>
        )}
        <li className={location.pathname === "/about" ? "active" : ""}>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <div className="auth-buttons">
        {!currentUser ? (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </>
        ) : (
          <div className="user-section">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        
        {/* Dark Mode Toggle Button (unchanged) */}
        <button className="dark-mode-btn" onClick={toggleDarkMode}>
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;