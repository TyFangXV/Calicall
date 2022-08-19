import { atom } from "recoil";
import { IMessage, IUser } from "../types";


interface IUnseemMessagesDM {
    ChannelID:IUser,
    MessageID:IMessage
}

interface IuserAlertMessage {
    type : "INFO" | "WARNING" | "ERROR"
    id: string;
    message: string;
    onclick?: () => void;
  }


export const UnSeemMessage = atom<IUnseemMessagesDM[]>({
    key: "UnSeemMessage",
    default: []
})

export const chatWindowScrolled = atom<boolean>({
    key: "chatWindowScrolled",
    default: false
})

export const UserAlertAtom = atom<IuserAlertMessage>({
    key: "UserAlert",
    default: {
        message: "",
        type: "INFO",
        id : "",
        onclick : () => {},
    }
})