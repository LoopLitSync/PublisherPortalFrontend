import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import keycloak from "./keycloak";
import LoadingSpinner from "./components/LoadingSpinner";

const PrivateRoute = () => {
    const { isAuthenticated, isAdmin } = useAuth();
    const [loginUrl, setLoginUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!keycloak.authenticated) {
            keycloak.createLoginUrl().then(url => setLoginUrl(url));
        }
    }, [keycloak.authenticated]);

    if (isAuthenticated === null) {
        return <div><LoadingSpinner/></div>;
    }

    if (!isAuthenticated && loginUrl) {
        return <Navigate to={loginUrl} />;
    }

    if (isAdmin) {
        return <Navigate to="/admin" />;
    }


    return isAuthenticated ? <Outlet /> : <div><LoadingSpinner/></div>;
};

export default PrivateRoute;
