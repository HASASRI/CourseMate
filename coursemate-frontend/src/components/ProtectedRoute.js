import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js'; // We'll create this next

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;