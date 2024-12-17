

import { HttpException, HttpStatus, Injectable} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { FileFolder, fileService, FileType } from "src/file/file.service";
import { TokenService } from "src/token/token.service";
import { Book, BookDocument } from "src/user/schemas/book.shema";
import { Token, TokenDocument } from "src/user/schemas/token.schema";
import { User, UserDocument } from "src/user/schemas/user.sсhema";
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BookDto } from "src/dto/book-dto";
import { Types } from 'mongoose';
@Injectable()
export class BookService {
    constructor(private fileService: fileService,
        private tokenService: TokenService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        @InjectModel(Book.name) private bookModel: Model<BookDocument>,
        private readonly httpService: HttpService
    ) {}

    async translateText(text: string, targetLanguage: string, sourceLanguage: string): Promise<string> {
      const apiUrl = `https://lingva.ml/api/v1/${sourceLanguage}/${targetLanguage}/${encodeURIComponent(text)}`;
    
      try {
        const response = await firstValueFrom(this.httpService.get(apiUrl));
        return response.data.translation;
      } catch (error) {
        console.error('Translation API error:', error.response?.data || error.message);
        throw new Error('Translation failed');
      }
    }

    async addNewBook (file, image, refreshToken: string, title: string, author: string): Promise<Book> {
try {

  console.log(image)
    if (!refreshToken) {
        throw new HttpException(
          'Invalid or expired refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (!file) {
        throw new HttpException(
          'No book file provided',
          HttpStatus.BAD_REQUEST,
        );
      }
        const tokenData = await this.tokenService.findToken(refreshToken);
        const user = await this.userModel.findOne({_id: tokenData.user})
         if(!user) {
            throw new HttpException(
                'User not found', 
                HttpStatus.NOT_FOUND,
            );
         }
         const logoPath = await this.fileService.createFile(FileType.BOOKLOGO, image)
         const filePath = await this.fileService.BookFile(file)
         const book = await this.bookModel.create({user: user._id as ObjectId, book: filePath,image: logoPath, title, author})
         user.books.push(book);
         await user.save();

         return book
       } catch(e) {
        throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    async userbooks(userId: ObjectId, count = 10, offset = 0): Promise<Book[]> {
      try {
        const user = await this.userModel.findOne({ _id: userId });
        if (!user) {
          throw new HttpException(
            'User not found',
            HttpStatus.NOT_FOUND,
          );
        }
     
        const books = await this.bookModel.find({ '_id': { $in: user.books } })
      .skip(Number(offset))
      .limit(Number(count));

        return books;
      } catch (e) {
        console.error('Помилка при виконанні запиту до сервісу userbooks:', e);
        throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    
    

   async getOne (id: string): Promise<Book> {
    const book = this.bookModel.findById(id)
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
  }
    return book
   }


   async deleteBook (id: string): Promise<Book> {
    try {
      if(!id) {
        throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      const book = await this.bookModel.findById(id)
      console.log(book)
      await this.fileService.removeFile(FileFolder.BOOKLOGO, book.image)
      await this.fileService.removeFile(FileFolder.BOOK, book.book)
      const user = await this.userModel.findById(book.user);
      console.log(`user ${user}`)
      user.books = user.books.filter((bookId) => bookId.toString() !== book._id.toString());
     await user.save();
      const removedBook = await this.bookModel.findByIdAndDelete(id);
      console.log(removedBook)
      return removedBook
    } catch(e) {
      console.log(e)
    }
   }
} 





















