import { atom } from "recoil";
import { IMessage, IUser } from "../types";


interface IUnseemMessagesDM {
    ChannelID:IUser,
    MessageID:IMessage
}

interface IuserAlertMessage {
    type : "INFO" | "WARNING" | "ERROR" | "RINGTONE"
    id: string;
    message: string;
    onclick?: () => void;
  }


interface IDMcallLogger {
    user : IUser,
    isCalling:boolean,
    isLocalUserCalling:boolean
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

export const DMcallLogger = atom<IDMcallLogger>({
    key : "DMcallLogger",
    default : {
        user : {} as IUser,
        isCalling : false,
        isLocalUserCalling : false
    }
})