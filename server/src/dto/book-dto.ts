import { ObjectId } from "mongoose";


export class BookDto{
    readonly filePath: string;
    readonly logoPath: string;
    readonly bookId: ObjectId;
}
