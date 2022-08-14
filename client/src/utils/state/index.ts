import { atom } from "recoil";
import { IMessage, IUser } from "../types";


export const UserStateAtom = atom<IUser>({
    key: "UserState",
    default: {
        id: "",
        name: "",
        email: "",
        signedIn: false,
    }
})


export const LocalInputMessageAtom = atom<IMessage>({
    key: "LocalInputMessage",
    default: {
        message: "",
        type : "TEXT",
        from : "",
        to : "",
    }
})