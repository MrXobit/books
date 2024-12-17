import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from 'src/Error/ApiError';


@Injectable()
export class ValidateRequestBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const errors: string[] = [];

   
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.push('Будь ласка, введіть коректний email.');
    }

    if (!password || password.length < 6) {
      errors.push('Пароль має бути не менше 6 символів.');
    }

    
    if (errors.length) {
      throw ApiError.BadRequest('Помилка валідації', errors); 
    }

    next(); 
  }
}
