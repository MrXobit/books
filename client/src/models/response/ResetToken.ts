import { IUser } from "./IUser";

export interface  resetDto{
    resetToken: string;
    userDto: IUser;
}