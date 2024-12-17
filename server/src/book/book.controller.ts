import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { BookService } from "./book.service";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { Types } from 'mongoose';
@Controller()
export class BookController {
  constructor(private bookService: BookService) {}



  @Get('translate')
  async translate(
    @Query('text') text: string,
    @Query('targetLanguage') targetLanguage: string,
    @Query('sourceLanguage') sourceLanguage: string,
  ): Promise<string> {
    return this.bookService.translateText(text, targetLanguage, sourceLanguage);
  }

  @Post('addbook')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]))
  async addNewBook(@UploadedFiles() files, @Req() req: Request, @Res() res: Response, @Body() body: {title: string, author: string}) {
    const {file, image} = files
    const refreshToken = req.cookies.refreshToken;
    const {title, author} = body
    try {
      const result = await this.bookService.addNewBook(file[0], image[0], refreshToken, title, author);
      return res.json(result); 
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to upload book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Get('userbooks')
  async userBooks(
      @Req() req: Request, 
      @Res() res: Response,
      @Query('userId') userId: ObjectId,
      @Query('count') count: number,
      @Query('offset') offset: number
  ) {
      try {
          const books = await this.bookService.userbooks(userId, count, offset);
          return res.json(books);  
      } catch (error) {
          console.error(error);
          throw new HttpException('Failed', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Get('getonebook/:id')
  async getOne (@Param('id') id: string) {
    return this.bookService.getOne(id) 
  }

  @Delete('deletebook')
  async deleteBook (@Query('id') id: string) {
    await this.bookService.deleteBook(id);
    return null
  }
}
