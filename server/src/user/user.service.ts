import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.sсhema";
import { Model, ObjectId } from "mongoose";
import { Token, TokenDocument } from "./schemas/token.schema";
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { MailService } from "src/mail/mail.service";
import { TokenService } from "src/token/token.service";
import { UserDto } from "src/dto/user-dto";
import { registerDto } from "src/dto/registr-dto";
import { FileFolder, fileService, FileType } from "src/file/file.service";
import { resetDto } from "src/dto/reset-dto";
import { ApiError } from "src/Error/ApiError";




@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
              private mailService: MailService,
              private tokenService: TokenService,
              private fileService: fileService,
) {}

    async registration (email: string,password: string, picture: Express.Multer.File | null): Promise<registerDto> {
        try {
            const candidate = await this.userModel.findOne({email})
            const logo = picture ? await this.fileService.createFile(FileType.USERLOGO,picture) : null;
            if (candidate) {
                throw ApiError.BadRequest(`Користувач з поштовою адресою ${email} вже існує`);
            }
            const hashPassword = await bcrypt.hash(password, 5)
            const activationLink = uuid.v4()
            const user = await this.userModel.create({email, logo, password: hashPassword, activationLink})
            await this.mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`)

            const userDto = new UserDto(user)
            const tokens = this.tokenService.generateTokens({...userDto})
            await this.tokenService.saveToken(userDto._id, tokens.refreshToken)

            return {
                ...tokens,
                userDto: userDto
            }
        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            }
            throw ApiError.InternalError('Внутрішня помилка сервера. Спробуйте ще раз пізніше.');
        }
    
    }

    async login (email: string, password: string): Promise<registerDto> {
        try {
            const user = await this.userModel.findOne({email})
            if (!user) {
                throw ApiError.BadRequest(`Користувач з поштовою адресою ${email} не знайдений`);
            }
            const isPassValid = await bcrypt.compare(password, user.password)
            if (!isPassValid) {
                throw ApiError.BadRequest('Невірний пароль');
            }
    
            const userDto = new UserDto(user)
            const tokens = this.tokenService.generateTokens({...userDto})
            await this.tokenService.saveToken(userDto._id, tokens.refreshToken)
            
            return {
                ...tokens, 
                userDto: userDto
            }
        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            }
            throw ApiError.InternalError('Внутрішня помилка сервера. Спробуйте ще раз пізніше.');
        }
    }

    async logout (refreshToken: string) {
        const token = await this.tokenService.removeToken(refreshToken)
        return token
    }

    async activate (activationLink: string) {
       const user = await this.userModel.findOne({activationLink})
       if(!user) {
        throw new HttpException(
            'Internal server error. Please try again later.',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
       } 
       user.isActivated = true;
       await user.save()
    }

    async refresh (refreshToken: string): Promise<registerDto> {
         if(!refreshToken) {
            throw new HttpException(
                'Invalid or expired refresh token',  
                HttpStatus.UNAUTHORIZED,  
            );
         }
         const userData = this.tokenService.validateRefreshToken(refreshToken)
         const tokenFromDb = await this.tokenService.findToken(refreshToken)
         if(!userData || !tokenFromDb) {
            throw new HttpException(
                'Invalid or expired refresh token',  
                HttpStatus.UNAUTHORIZED,  
            );
         }
         const user = await this.userModel.findOne({_id: tokenFromDb.user})
         const userDto = new UserDto(user)
         const tokens = this.tokenService.generateTokens({...userDto})
         await this.tokenService.saveToken(userDto._id, tokens.refreshToken)
 
         return {
             ...tokens, 
             userDto: userDto
         }
    }


    async users (count = 10, offset = 0): Promise<User[]> {
        const users = await this.userModel.find().skip(offset).limit(Number(count))
        return users
    }


    async getLogo(id: ObjectId): Promise<string> {
        const user = await this.userModel.findById(id); 
        return user.logo; 
    }

    async changeLogo(id: ObjectId, newUserLogo): Promise<string>{
         if(!id || !newUserLogo) {
            throw new HttpException(
                'Internal server error. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
         }

         const user = await this.userModel.findById(id)

         if (!user) {
            throw new HttpException(
              'User not found.',
              HttpStatus.NOT_FOUND,
            );
          }
        if(user.logo) {
            await this.fileService.removeFile(FileFolder.USERLOGO ,user.logo)
        }
         const newUserLogoUpload = await this.fileService.createFile(FileType.USERLOGO, newUserLogo)
         user.logo = newUserLogoUpload
         user.save()

         return newUserLogoUpload

    }


    
    async resetPaswordemail (email: string): Promise<resetDto> {
        try {
            const user = await this.userModel.findOne({email})
            if (!user) {
                throw ApiError.BadRequest('Користувача з такою поштовою адресою не знайдено.');
            }            
            const userDto = new UserDto(user)
            const activationLink = uuid.v4()
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 5);
     
            user.resetPasswordExpiry = expirationTime; 
            user.resetPasswordLink = activationLink
            const {token} = await this.tokenService.generateToken({...userDto})
            user.resetToken = token
            await user.save()
            const userSecondDto = new UserDto(user)
            await this.mailService.sendActivationMail(email, `${process.env.API_URL}/resetpassword/${activationLink}`)
            return {
             resetToken: token,
             userDto: { ...userSecondDto }
           };
        } catch (e) {
            if (e instanceof ApiError) {
                throw e;
            }
            throw ApiError.InternalError('Не вдалося відправити лист для скидання пароля. Спробуйте пізніше.');
        }
    }

      async resetpasswordLink (link: string) {
        try {
            const user = await this.userModel.findOne({resetPasswordLink: link})
            if(!user) {
             if (!user) {
                 throw ApiError.BadRequest('Невірне або прострочене посилання для скидання пароля.');
             }
            }
            const currentTime = new Date();
            if (user.resetPasswordExpiry < currentTime) {
             throw ApiError.BadRequest('Посилання для скидання пароля прострочене.');
         }
            user.resetIsActivated = true
            await user.save()
            console.log(`link user ${user}`)
        }catch (e) {
            if (e instanceof ApiError) {
                throw e;
            }
            throw ApiError.InternalError('Помилка під час активації посилання для скидання пароля.');
        }
    }


async resetPasswordFinal(password: string, email: string): Promise<User> {
    try {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Користувач не знайдений.');
        }
        if (!user.resetIsActivated) {
            throw ApiError.BadRequest('Посилання для скидання пароля не активовано або прострочене.');
        }
        const hashPassword = await bcrypt.hash(password, 5);

        user.resetIsActivated = false;
        user.password = hashPassword;
        user.resetPasswordLink = '';
        user.resetPasswordExpiry = null;
        await this.tokenService.deleteResetToken(user.resetToken)
        await user.save();


        return user;
    } catch (e) {
        if (e instanceof ApiError) {
            throw e;
        }
        throw ApiError.InternalError('Не вдалося скинути пароль. Спробуйте пізніше.');
    }
}
async refreshResetToken(resetToken: string): Promise<resetDto> {
    try {
        console.log('Received resetToken:', resetToken);
        const user = await this.userModel.findOne({ resetToken });
        console.log('User found:', user);
        if (!user) {
            throw ApiError.BadRequest('Користувача не знайдено або токен недійсний.');
        }
        const userData = await this.tokenService.validateRefreshToken(resetToken);
        if (!userData) {
            throw ApiError.BadRequest('Токен недійсний або прострочений.');
        }
        await this.tokenService.deleteResetToken(resetToken);
        const userDto = new UserDto(user);
        const { token } = await this.tokenService.generateToken({...userDto});
        user.resetToken = token;
        await user.save();
    
    
        return {
            resetToken: token,
             userDto: {...userDto}
        };
    } catch (e) {
        if (e instanceof ApiError) {
            throw e;
        }
        throw ApiError.InternalError('Не вдалося оновити токен для скидання пароля. Спробуйте пізніше.');
    }
}

     async resendActivation (email: string) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw ApiError.BadRequest('Користувач не знайдений.');
            }
            if (user.isActivated) {
                throw ApiError.BadRequest('Ваш акаунт вже активований.');
              }
    
              const activationLink = uuid.v4();
              user.activationLink = activationLink;
              await user.save();
    
              await this.mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);  
        } catch(e) {
            if (e instanceof ApiError) {
                throw e;
            }
            throw ApiError.InternalError('Не вдалося оновити токен для скидання пароля. Спробуйте пізніше.');
        }
     }
}




