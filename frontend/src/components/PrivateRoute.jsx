import { Navigate } from "react-router-dom";

/** Wraps protected routes. If no token → redirect to /login. */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
