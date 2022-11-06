import { atom } from "recoil";
import { IFriendRequest, IMessage, IUser } from "../types";


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
    callAccepted:boolean
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
        isLocalUserCalling : false,
        callAccepted : false
    }
})

export const FriendList = atom<IFriendRequest[]>({
    key: "FriendsList",
    default : []
})

export const currentFriend = atom<IUser>({
    key : "CurrentUser",
    default: {
        id: "",
        name : "",
        profile_pic : "",
        email : "",
        signedIn : false

    } 
})

export const userCalled = atom<boolean>({
 key : "userCalled",
 default: false
})