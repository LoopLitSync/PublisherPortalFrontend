export interface Notification {
    id: number;
    type: string;
    message: string;
    createdDate: Date;
    isRead: boolean;
}