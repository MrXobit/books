import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import { Book } from './book.shema';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop()
    logo: string;

    @Prop({required: true})
    password: string

    @Prop({default: false})
    isActivated: boolean

    @Prop()
    activationLink: string

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}], required: false })
    books?: Book[]

    @Prop()
    resetPasswordLink: string

    @Prop({default: false})
    resetIsActivated: boolean

    @Prop()
    resetPasswordExpiry: Date | null;

    @Prop()
    resetToken: string | null
}

export const UserSchema = SchemaFactory.createForClass(User);