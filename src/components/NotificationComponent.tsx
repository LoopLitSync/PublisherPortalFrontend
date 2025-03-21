import { useEffect, useState } from "react";
import { Notification } from "../models/Notification";
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";
import keycloak from "../keycloak";

function NotificationComponent() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (keycloak.authenticated) {
            const keycloakId = keycloak.tokenParsed?.sub;

            if (!keycloakId) {
                console.error("Keycloak ID not found in token");
                return;
            }

            const socket = new SockJS('http://localhost:8081/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    client.subscribe(`/topic/notifications/${keycloakId}`, (message) => {
                        const newNotification: Notification = JSON.parse(message.body);
                        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
                    });
                },
                onDisconnect: () => {
                    console.log("Disconnected from WebSocket");
                }
            });

            client.activate();

            return () => {
                client.deactivate();
            };
        }
        else {
            console.error("User is not authenticated");
        }
    }, []);

    return (
        <>
            <div>
                {notifications.map((notification) => (
                    <div key={notification.id} className="notification">
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdDate).toLocaleString()}</small>
                    </div>
                ))}
            </div>
        </>
    )
}

export default NotificationComponent;