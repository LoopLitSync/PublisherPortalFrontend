import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "master",
    clientId: "PublisherPortal",
});

export const initializeKeycloak = (): Promise<Keycloak> => {
    return new Promise<Keycloak>((resolve, reject) => {
        if (keycloak.authenticated !== undefined) {
            resolve(keycloak);
            return;
        }

        keycloak.init({ onLoad: 'check-sso' })
            .then(authenticated => {
                if (authenticated) {
                    console.log('User is authenticated');
                } else {
                    console.log('User is not authenticated');
                }
                resolve(keycloak);
            })
            .catch(error => {
                console.error('Failed to initialize Keycloak:', error);
                reject(error);
            });
    });
};

export default keycloak;
