import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import keycloak from "./keycloak";

const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    const [loginUrl, setLoginUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!keycloak.authenticated) {
            keycloak.createLoginUrl().then(url => setLoginUrl(url));
        }
    }, [keycloak.authenticated]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated && loginUrl) {
        return <Navigate to={loginUrl} />;
    }


    return isAuthenticated ? <Outlet /> : <div>Loading...</div>;
};

export default PrivateRoute;
