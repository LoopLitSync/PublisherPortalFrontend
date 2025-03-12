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

    useEffect(() => {
        if (keycloak.authenticated) {
            const publisher = keycloak.tokenParsed;
            const publisherData = {
                keycloakId: publisher?.sub,
                name: publisher?.preferred_username,
                email: publisher?.email,
                picture: publisher?.picture,
                isEnabled: true, 
            };

            fetch("http://localhost:8081/api/v1/publishers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${keycloak.token}`,
                },
                body: JSON.stringify(publisherData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Publisher registered:", data);
                    localStorage.setItem('loggedInPublisher', JSON.stringify(data));
                })
                .catch(error => {
                    console.error("Error registering publisher:", error);
                });
        }
    }, []); 

    if (isAuthenticated === null || (!isAuthenticated && loginUrl === null)) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to={loginUrl!} />;
};

export default PrivateRoute;
