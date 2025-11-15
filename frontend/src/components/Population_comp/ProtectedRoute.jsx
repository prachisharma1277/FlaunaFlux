// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowed }) {
  // Retrieve user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // User not logged in
  if (!user) return <Navigate to="/login" replace />;
  // User type not allowed for the page
  if (user.type !== allowed) return <Navigate to="/" replace />;

  return children; // Render the protected page
}
