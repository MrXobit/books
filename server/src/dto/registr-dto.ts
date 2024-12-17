import { ObjectId } from "mongoose";
import { UserDto } from "./user-dto";

export class registerDto {
    readonly accessToken: string;
    readonly refreshToken: string;
    readonly userDto: UserDto;
}
