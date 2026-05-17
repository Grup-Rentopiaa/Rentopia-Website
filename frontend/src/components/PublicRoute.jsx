import { Navigate } from "react-router-dom";

/** Wraps public-only routes (/, /login, /register).
 *  If already logged in → redirect to /home. */
export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/home" replace />;
  return children;
}
