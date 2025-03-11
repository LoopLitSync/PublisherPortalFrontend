import React, { useEffect, useState } from 'react';
import Keycloak from "keycloak-js";
import { initializeKeycloak } from '../keycloak';

// import { useKeycloak } from '@react-keycloak/web';

const LoginPage: React.FC = () => {
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
    // const [authenticated, setAuthenticated] = useState<boolean | undefined>(false);

    useEffect(() => {
        initializeKeycloak()
            .then((keycloakInstance) => {
                setKeycloak(keycloakInstance);
                // setAuthenticated(keycloakInstance.authenticated);
            })
            .catch((error) => {
                console.error('Failed to initialize Keycloak:', error);
            });
    }, []);

    if (!keycloak) {
        return <div>Loading...</div>;
    }

    const login = () => {
        keycloak.login();
    };

    return (
        <div>
            <h2>Login</h2>
            <button onClick={login}>Login with Keycloak</button>
        </div>
    );
};

export default LoginPage;
