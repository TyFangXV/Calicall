export interface IUser {
    id: string;
    name: string;
    email: string;
    signedIn: boolean;
}

export interface INotificationProps {
    sender: string
    message: string
    type : string
    id: string
    messenger: string
}
