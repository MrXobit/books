

import { ObjectId } from "mongodb";

export interface IUser {
    logo: string | null;
    email: string;
    isActivated: boolean;
    _id: ObjectId;
    resetPasswordLink?: string | null; 
    resetIsActivated?: boolean;
    resetPasswordExpiry?: Date | null;
}
