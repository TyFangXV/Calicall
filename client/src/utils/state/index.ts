import { atom } from "recoil";
import { IUser } from "../types";


export const UserStateAtom = atom<IUser>({
    key: "UserState",
    default: {
        id: "",
        name: "",
        email: "",
        signedIn: false,
    }
})
