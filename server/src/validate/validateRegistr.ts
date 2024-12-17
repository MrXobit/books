import { ValidationError } from 'express-validator';

export const validateRegistr = async (
  email: string,
  password: string,
  picture: Express.Multer.File | null
) => {
  const errors: { msg: string; field: string; location: string }[] = [];

  
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.push({
      msg: 'Invalid email format',
      field: 'email',
      location: 'body',
    });
  }

  
  if (!password || password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters long',
      field: 'password',
      location: 'body',
    });
  }

  if (picture) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(picture.mimetype)) {
      errors.push({
        msg: 'File must be an image (jpeg, png, gif, bmp, or webp)',
        field: 'picture',
        location: 'file',
      });
    }
  }


  if (errors.length > 0) {
    return errors;
  }

  return null; 
};
