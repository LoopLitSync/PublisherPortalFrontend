import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://lemur-17.cloud-iam.com/auth",
    realm: "litsync-keycloak",
    clientId: "PublisherPortal",
});

export const initializeKeycloak = (): Promise<Keycloak> => {
    return new Promise<Keycloak>((resolve, reject) => {
        keycloak.init({ onLoad: 'login-required' })
            .then(authenticated => {
                if (authenticated) {
                    console.log("User is authenticated");
                } else {
                    console.log("User is not authenticated, redirecting...");
                }
                resolve(keycloak);
            })
            .catch(error => {
                console.error("Failed to initialize Keycloak:", error);
                reject(error);
            });
    });
};

export default keycloak;

