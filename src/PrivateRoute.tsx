import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import keycloak from "./keycloak";

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [loginUrl, setLoginUrl] = useState<string | null>(null);

    const [isChecked, setIsChecked] = useState(false); // Track if we've already checked the user state

    useEffect(() => {
        if (keycloak.authenticated) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }

        if (!keycloak.authenticated) {
            keycloak.createLoginUrl().then(url => setLoginUrl(url));
        }

        // Set isChecked to true after the authentication status is determined
        if (!isChecked) {
            setIsChecked(true);
        }
    }, [keycloak.authenticated]); 

    useEffect(() => {
        if (keycloak.authenticated && isChecked) {
            const publisher = keycloak.tokenParsed;
            const publisherData = {
                keycloakId: publisher?.sub,
                name: publisher?.preferred_username,
                email: publisher?.email,
                picture: publisher?.picture,
                // isEnabled: true, 
            };

            const isPublisherRegistered = localStorage.getItem('publisherRegistered');
            
            if (isPublisherRegistered) {
                console.log("Publisher already registered, skipping registration.");
            } else {
                // Fetch the publisher info from backend using Keycloak ID
                fetch(`http://localhost:8081/api/v1/publishers/keycloak/${publisher?.sub}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${keycloak.token}`,
                    },
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json(); 
                        } else {
                            throw new Error('Publisher not found');
                        }
                    })
                    .then(existingPublisher => {
                        // console.log("Publisher already registered:", existingPublisher);
                        localStorage.setItem('publisherRegistered', 'true');
                        localStorage.setItem('loggedInPublisher', JSON.stringify(existingPublisher));
                    })
                    .catch(() => {
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
                                localStorage.setItem('publisherRegistered', 'true');
                                localStorage.setItem('loggedInPublisher', JSON.stringify(data));
                            })
                            .catch(error => {
                                console.error("Error registering publisher:", error);
                            });
                    });
            }
        }
    }, [isChecked, keycloak.authenticated]); 

    if (isAuthenticated === null || (!isAuthenticated && loginUrl === null)) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to={loginUrl!} />;
};

export default PrivateRoute;
