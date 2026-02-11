import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRecruiterRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "recruiter") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRecruiterRoute;
