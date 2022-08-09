export interface NotificationProps {
    sender: string
    message: string
    type : string
    messenger: string
    id: string
}

export interface connectedUser {
    userId: string
    connectedID: string
}

export interface IuserAlertMessage {
    message: string
    type: string
    to : string
    from : string
}