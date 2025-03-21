import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";


const AdminRoute = () => {
    const { isAdmin } = useAuth();
    
    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
