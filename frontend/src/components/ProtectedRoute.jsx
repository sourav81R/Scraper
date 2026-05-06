import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const { isAuthenticated, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner label="Checking session" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
