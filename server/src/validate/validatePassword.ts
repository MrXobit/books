export const validatePassword = async (
    password: string
  ) => {
    const errors: { msg: string; field: string; location: string }[] = [];
  
    // Валідація для password
    if (!password || password.length < 6) {
      errors.push({
        msg: 'Password must be at least 6 characters long',
        field: 'password',
        location: 'body',
      });
    }
  
    // Якщо є помилки, повертаємо їх
    if (errors.length > 0) {
      return errors;
    }
  
    return null; 
  };
  