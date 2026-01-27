import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const accessToken = useSelector((state) => state.adminAuth.accessToken);

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
