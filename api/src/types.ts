import { Request as ExpressRequest } from 'express';

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



export interface Request extends ExpressRequest {
  id: string;
}


export interface IMessage {
    from: string;
    to: string;
    message: string;
    type: "TEXT" | "GIF"
}

export interface DMCallData {
    from: string;
    to: string;
    id : string;

}

export interface ICallUser{
    me : string,
    to : string,
    signal : string,
}