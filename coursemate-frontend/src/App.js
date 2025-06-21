import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Placement from './pages/Placement';
import About from './pages/About';
import Signup from './pages/Signup';// 🔹 Added Signup Page
import Login from './pages/Login';    // 🔹 Added Login Page
import Footer from './components/Footer';
import Contact from './pages/Contact';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      {/* 🔽 Wrap everything with AuthProvider */}
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* 🔽 Protect these routes */}
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              
              <Route path="/contact" element={<Contact />} />

              <Route path="/courses/:id" element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/placement" element={
                <ProtectedRoute>
                  <Placement />
                </ProtectedRoute>
              } />
              
              {/* These routes remain unprotected */}
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;




