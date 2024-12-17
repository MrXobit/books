import { Module } from "@nestjs/common";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "src/user/schemas/token.schema";
import { User, UserSchema } from "src/user/schemas/user.sсhema";
import { Book , BookSchema} from "src/user/schemas/book.shema";
import { fileService } from "src/file/file.service";
import { TokenService } from "src/token/token.service";
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [BookController],
  providers: [BookService, fileService, TokenService],
    imports: [
        HttpModule,
        MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Book.name, schema: BookSchema}]),
      ],
  
}) export class BookModule {}