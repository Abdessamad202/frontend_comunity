import { Navigate, Outlet } from "react-router";
import { isFullAuth } from "../utils/localStorage"; // Importing the authentication utility function
const ProtectedRoute = () => {
  return isFullAuth() ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
