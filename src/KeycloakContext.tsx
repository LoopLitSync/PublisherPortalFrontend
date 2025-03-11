// src/KeycloakContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Keycloak from 'keycloak-js';

// Define the context value type
interface KeycloakContextType {
    keycloak: Keycloak | null;
    initialized: boolean;
}

// Create the Keycloak context
const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

// Custom hook to use Keycloak instance and its initialized state
export const useKeycloak = (): KeycloakContextType => {
    const context = useContext(KeycloakContext);
    if (!context) {
        throw new Error('useKeycloak must be used within a KeycloakProvider');
    }
    return context;
};

// KeycloakProvider component
interface KeycloakProviderProps {
    children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const keycloakInstance = new Keycloak({
            url: "http://localhost:8080",
            realm: "master",
            clientId: "PublisherPortal",
        });

        keycloakInstance.init({ onLoad: 'login-required' })
            .then(() => {
                setKeycloak(keycloakInstance);
                setInitialized(true);
            })
            .catch((error) => {
                console.error('Keycloak initialization failed', error);
                setInitialized(true); // Even if there is an error, set as initialized to avoid endless loading
            });
    }, []);

    return (
        <KeycloakContext.Provider value={{ keycloak, initialized }}>
            {children}
        </KeycloakContext.Provider>
    );
};