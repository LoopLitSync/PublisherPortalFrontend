import { createContext } from 'react';
import { Notification } from './models/Notification';

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
};

const NotificationContext = createContext<NotificationContextType>({ 
    notifications: [],
    addNotification: () => {},
});

export default NotificationContext;