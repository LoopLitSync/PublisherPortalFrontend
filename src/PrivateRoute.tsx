import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import keycloak from "./keycloak";

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loginUrl, setLoginUrl] = useState<string | null>(null);

    useEffect(() => {
        setIsAuthenticated(keycloak.authenticated ?? false);
        if (!keycloak.authenticated) {
            keycloak.createLoginUrl().then(url => setLoginUrl(url));
        }
    }, []);

    if (isAuthenticated === null || (!isAuthenticated && loginUrl === null)) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to={loginUrl!} />;
};

export default PrivateRoute;


