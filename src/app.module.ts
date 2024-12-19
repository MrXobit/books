

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenModel } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { FileModule } from './file/file.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BookModule } from './book/book.module';


@Module({
  imports: [
    UserModule,
    TokenModel,
    MailModule,
    FileModule,
    BookModule,
  

    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'src', 'static', 'logoUsers'),
      serveRoot: '/static/logo', 
    }),


    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'src', 'static', 'books'),  
      serveRoot: '/static/books',  
    }),

    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'src', 'static', 'logoBooks'),  
      serveRoot: '/static/logobooks',  
    }),


    MongooseModule.forRoot('mongodb+srv://marcis2023vlad:root@cluster0.1trhm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  ]
})
export class AppModule {}
