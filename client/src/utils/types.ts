export interface IUser {
    id: string;
    name: string;
    email: string;
    signedIn: boolean;
    profile_pic: string;
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

export interface IMessage {
    from: string;
    to: string;
    message: string;
    type: "TEXT" | "GIF"
}

export interface IClientMessage {
    from: string;
    to: string;
    id : string;
    message: string;
    created_at: Date;
    type: "TEXT" | "GIF"
}

export interface DMMessageType {
    User:IUser,
    Message:IClientMessage
}


export interface ICallUser{
    me : string,
    to : string,
    signal : string,
}