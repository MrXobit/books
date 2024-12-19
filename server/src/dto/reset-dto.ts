import { ObjectId } from "mongoose";
import { UserDto } from "./user-dto";


export class resetDto {
    readonly resetToken: string;
    readonly userDto: UserDto;
}
