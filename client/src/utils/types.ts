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

export interface IuserAlertMessage {
    message: string
    type: string
    to : string
    from : string
}



export interface IFriendRequest {
    senderId: string
    receiverId: string
    status: string
    id : string
    accepted: boolean
    receiver? : IUser
}