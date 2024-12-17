

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
  USERLOGO = 'logoUsers',
  BOOKLOGO = 'logoBooks'
}

export enum FileFolder {
  USERLOGO = 'logoUsers',
  BOOKLOGO = 'logoBooks',
  BOOK = 'books'
}

@Injectable()
export class fileService {
  async createFile(type: FileType,file: Express.Multer.File): Promise<string> {
    try {
      console.log(`file ${file.originalname}`)
      const fileExtension = file.originalname.split('.').pop();
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(process.cwd(), 'src', 'static', type); 
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      const fullFilePath = path.join(filePath, fileName);
      fs.writeFileSync(fullFilePath, file.buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(
        'Internal server error. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  

  async BookFile (file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = file.originalname.split('.').pop()
      const allowedExtensions = ['txt', 'pdf', 'epub', 'mobi'];
      if (!allowedExtensions.includes(fileExtension)) {
        throw new HttpException(
          'Unsupported file type. Allowed types are txt, pdf, epub, mobi.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const maxSize = 50 * 1024 * 1024; // 50 МБ
      if (file.size > maxSize) {
        throw new HttpException(
          `File size exceeds the limit of ${maxSize / 1024 / 1024} MB.`,
          HttpStatus.BAD_REQUEST,
        );
      }
  
      const fileName = uuid.v4() + '.' + fileExtension;
      const filePath = path.resolve(process.cwd(), 'src', 'static', 'books')
  
      if(!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }
  
      const fullFilePath = path.join(filePath, fileName)
      fs.writeFileSync(fullFilePath, file.buffer);
      return fileName
    } catch(e) {
      throw new HttpException(
        'Internal server error. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  removeFile(type: FileFolder, fileName: string): void {
    try {
    
      const filePath = path.resolve(process.cwd(), 'src', 'static', type, fileName);
      console.log(`filepath ${filePath}`)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Файл ${fileName} успішно видалено.`);
      } else {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
    } catch (e) {
      throw new HttpException(
        'Error while deleting file.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}



