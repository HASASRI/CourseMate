import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Add this import
import "./Login.css"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Option 1: Use your existing axios approach
      const response = await axios.post("http://localhost:5000/api/login", formData);
      const token = response.data.token;
      
      // Store token and update auth context
      localStorage.setItem("token", token);
      login(token); // Update the auth context state
      
      setMessage("Login successful!");
      navigate("/courses"); // Use navigate instead of window.location
      
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="login-message">{message}</p>
        <p>
          Don't have an account?{" "}
          <span 
            onClick={() => navigate("/signup")} 
            style={{ color: "blue", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;



