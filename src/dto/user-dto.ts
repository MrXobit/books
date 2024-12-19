
import { ObjectId } from "mongoose";

export class UserDto {
    readonly logo: string | null;
    readonly email: string;
    readonly _id: ObjectId;
    readonly isActivated: boolean;
    readonly resetPasswordLink: string | null;
    readonly resetIsActivated: boolean;
    readonly resetPasswordExpiry: Date | null;

    constructor(model: any) {
        this.logo = model.logo || null;
        this.email = model.email;
        this._id = model._id;
        this.isActivated = model.isActivated || false; 
        this.resetPasswordLink = model.resetPasswordLink || null;
        this.resetIsActivated = model.resetIsActivated || false; 
        this.resetPasswordExpiry = model.resetPasswordExpiry || null; 
    }
}
