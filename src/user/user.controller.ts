import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, Req, RequestTimeoutException, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from 'express';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { validateRegistr } from "src/validate/validateRegistr";
import { ObjectId } from "mongoose";
import { validatePassword } from "src/validate/validatePassword";
import { ApiError } from "src/Error/ApiError";
import { json } from "stream/consumers";


@Controller()
export class UserController {xb 
    constructor(private userService: UserService) {}

    @Post('register')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'picture', maxCount: 1}
    ]))
    async registration(@UploadedFiles() files: { picture?: Express.Multer.File[] },@Body() body: {email: string, password: string},
    @Res() res: Response,
) {
    try {
      
        const picture = files?.picture?.[0] || null
        const {email, password} = body

        const userData = await this.userService.registration(email, password, picture)
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
    } catch (e) {
        if (e instanceof ApiError) {
            return res.status(e.status).json({ message: e.message, errors: e.errors });
        }
        console.error(e); 
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
 }

    @Post('login')
    async login(@Res() res: Response, @Body() body: {email: string, password: string}) {
        try {
            const {email, password} = body
            const userData = await this.userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData)
        }  catch (e) {
            if (e instanceof ApiError) {
                return res.status(e.status).json({ message: e.message, errors: e.errors });
            }
            console.error(e); 
            return res.status(500).json({ message: 'Внутрішня помилка сервера. Спробуйте ще раз пізніше.' })
        }
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const token = await this.userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch(e) {
            throw new HttpException(
                'Internal server error. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('activate/:link')
    async activate(@Res() res: Response ,@Param('link') link: string) {
    try {
        await this.userService.activate(link)
        return res.redirect(`${process.env.CLIENT_URL}/books`)
    } catch(e) {
        throw new HttpException(
            'Internal server error. Please try again later.',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
        
    }

    @Get('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw new HttpException(
                    'Refresh token not found in cookies.',
                    HttpStatus.BAD_REQUEST,
                );
            }

         const userData = await this.userService.refresh(refreshToken)
         res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
         return res.json(userData)
        } catch(e) {
            console.error('Error:', e.message); 
            throw new HttpException(
                'Internal server error. Please try again later.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('users')
    users(@Query('count') count: number,
    @Query('offset') offset: number) {
        return this.userService.users(count, offset)
    }

    @Get('logo')
    user(@Query('id') id: ObjectId) { 
        return this.userService.getLogo(id);
    }

    @Post('changeLogo')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'newUserLogo', maxCount: 1}
    ]))
    changeLogo(@UploadedFiles() file: { newUserLogo: Express.Multer.File[] }, @Query('id') id: ObjectId) {
      const {newUserLogo} = file
      return this.userService.changeLogo(id, newUserLogo[0])
    }



    @Post('resetpasswordemail')
     async resetPaswordemail (@Body() body: {email: string}, @Res() res: Response) {
        try {
            const {email} = body
            const user = await this.userService.resetPaswordemail(email)
            res.cookie('resetToken', user.resetToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(user)
        } catch (e) {
            if (e instanceof ApiError) {
                return res.status(e.status).json({ message: e.message, errors: e.errors });
            }
            console.error(e); 
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
    }

    @Get('resetpassword/:link')
    async resetpasswordLink(@Res() res: Response ,@Param('link') link: string) {
    try {
        await this.userService.resetpasswordLink(link)
        return res.redirect(`${process.env.CLIENT_URL}/reset-password`)
    } catch (e) {
        if (e instanceof ApiError) {
            return res.status(e.status).json({ message: e.message, errors: e.errors });
        }
        console.error(e); 
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
        
    }


    @Post('resetpasswordfinal')
async resetPasswordFinal(
    @Body() body: { password: string; email: string },
    @Res() res: Response,
) {
    try {
        const { password, email } = body;

        const user = await this.userService.resetPasswordFinal(password, email);
        return res.json(user)
    } catch (e) {
        if (e instanceof ApiError) {
            return res.status(e.status).json({ message: e.message, errors: e.errors });
        }
        console.error(e); 
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
}



@Get('refreshReset')
async refreshResetToken(@Req() req: Request, @Res() res: Response) {
    try {
        const { resetToken } = req.cookies;
        console.log('Cookies:', req.cookies);

        if (!resetToken) {
            throw new HttpException(
                'Refresh token not found in cookies.',
                HttpStatus.BAD_REQUEST,
            );
        }

     const userData = await this.userService.refreshResetToken(resetToken)
     res.cookie('resetToken', userData.resetToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
     return res.json({...userData})
    }catch (e) {
        if (e instanceof ApiError) {
            return res.status(e.status).json({ message: e.message, errors: e.errors });
        }
        console.error(e); 
        return res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
}

@Post('resend-activation')
async resendActivation (@Body() body: {email: string}, @Res() res: Response) {
    try {
        const { email } = body;
        const userData = await this.userService.resendActivation(email)
        return res.json(userData)
    } 
        catch (e) {
            if (e instanceof ApiError) {
                return res.status(e.status).json({ message: e.message, errors: e.errors });
            }
            console.error(e); 
            return res.status(500).json({ message: 'Internal server error. Please try again later.' });
        }
    
}

@Get('hello')
getHello(): { message: string } {
    return { message: 'Привіт, світ!' };
}
}



