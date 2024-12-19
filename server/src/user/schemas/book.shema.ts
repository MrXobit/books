import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import { User } from './user.sсhema';

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ required: true })
    book: string;  

    @Prop({ required: true })
    image: string;  

    @Prop({ required: true })
    author: string;  

    @Prop({ required: true })
    title: string; 
}

export const BookSchema = SchemaFactory.createForClass(Book);