import { createContext, useContext, useState, useEffect } from "react";
import keycloak from "./keycloak";
import { Publisher } from "./models/Publisher";

interface AuthContextType {
    publisher: Publisher | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

import { ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [publisher, setPublisher] = useState<Publisher | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (keycloak.authenticated) {
            const storedPublisher = localStorage.getItem("loggedInPublisher");
            if (storedPublisher) {
                setPublisher(JSON.parse(storedPublisher));
                setIsAuthenticated(true);
            } else {
                const publisherData: Publisher = {
                    keycloakId: keycloak.tokenParsed?.sub || "",
                    name: keycloak.tokenParsed?.preferred_username || "",
                    email: keycloak.tokenParsed?.email || "",
                    picture: keycloak.tokenParsed?.picture,
                };

                fetch(`http://localhost:8081/api/v1/publishers/keycloak/${publisherData.keycloakId}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${keycloak.token}` },
                })
                    .then(response => response.ok ? response.json() : Promise.reject("Publisher not found"))
                    .then(existingPublisher => {
                        setPublisher(existingPublisher);
                        localStorage.setItem("loggedInPublisher", JSON.stringify(existingPublisher));
                        setIsAuthenticated(true);
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
                            .then(newPublisher => {
                                setPublisher(newPublisher);
                                localStorage.setItem("loggedInPublisher", JSON.stringify(newPublisher));
                                setIsAuthenticated(true);
                                window.location.reload();
                            })
                            .catch(error => console.error("Error registering publisher:", error));
                    });
            }
            const roles = keycloak.tokenParsed?.realm_access?.roles || [];
            setIsAdmin(roles.includes("admin"));
        }
    }, [keycloak.authenticated]);

    return (
        <AuthContext.Provider value={{ publisher, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
