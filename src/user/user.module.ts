import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "./schemas/token.schema";
import { User, UserSchema } from "./schemas/user.sсhema";
import { TokenService } from "src/token/token.service";
import { MailService } from "src/mail/mail.service";
import { fileService } from "src/file/file.service";
import { ValidateRequestBodyMiddleware } from "src/Middleware/ValidateRequestBodyMiddleware";


@Module({
   imports: [
     MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
     MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
   ],
  controllers: [UserController],
  providers: [UserService, TokenService, MailService, fileService]
 })export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateRequestBodyMiddleware).forRoutes('register');
    consumer.apply(ValidateRequestBodyMiddleware).forRoutes('login');
  }
}