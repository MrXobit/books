import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "src/user/schemas/token.schema";
import { User, UserSchema } from "src/user/schemas/user.sсhema";


@Module({
    imports: [
        MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
      ],
  providers: [TokenService]
}) export class TokenModel {}