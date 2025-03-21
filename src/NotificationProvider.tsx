import { useEffect, useState } from "react";
import { Notification } from "./models/Notification";
import SockJS from 'sockjs-client';
import { Client } from "@stomp/stompjs";
import keycloak from "./keycloak";
import { toast } from "react-toastify";
import NotificationContext from './NotificationContext';

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);

        toast.info(notification.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    useEffect(() => {
        if (keycloak.authenticated) {
            const keycloakId = keycloak.tokenParsed?.sub;
            if (!keycloakId) return;

            const socket = new SockJS('http://localhost:8081/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
                onConnect: () => {
                    client.subscribe(`/topic/notifications/${keycloakId}`, (message) => {
                        const newNotification: Notification = JSON.parse(message.body);
                        addNotification(newNotification);
                    });
                },
            });

            client.activate();
            return () => {
                client.deactivate();
            };
        }
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
