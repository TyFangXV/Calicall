import { atom } from "recoil";
import { IMessage, IUser } from "../types";


interface IUnseemMessagesDM {
    ChannelID:IUser,
    MessageID:IMessage
}

interface IuserAlertMessage {
    id: string;
    message: string;
    onclick?: () => void;
  }

export const UserStateAtom = atom<IUser>({
    key: "UserState",
    default: {
        id: "",
        name: "",
        email: "",
        signedIn: false,
    }
})


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
        id : "",
        onclick : () => {},
    }
})