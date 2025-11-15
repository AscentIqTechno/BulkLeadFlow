import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const localUser = localStorage.getItem("reachiq_user");

  // If no user found → redirect to login
  if (!localUser) {
    return <Navigate to="/ReachIQ" replace />;
  }

  return children;
};

export default PrivateRoute;
