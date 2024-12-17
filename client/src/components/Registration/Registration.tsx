import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { registration, resendActivation, setError } from '../../store/userSlice';
import { Link } from 'react-router-dom';
import './RegistrationForm.css'; 
import Loading from '../Loading/Loading';

const RegistrationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [frontError, setFrontError] = useState<string | null>(null); 
  const { isAuth } = useSelector((state: RootState) => state.user);
  const user = useSelector((state: RootState) => state.user.user);
  const { isLoading } = useSelector((state: RootState) => state.user);
  const error = useSelector((state: RootState) => state.user.error);

  
  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFrontError('Будь ласка, заповніть всі поля.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFrontError('Будь ласка, введіть коректний email.');
      return false;
    }
    if (formData.password.length < 6) {
      setFrontError('Пароль має бути не менше 6 символів.');
      return false;
    }
    setFrontError(null); 
    return true;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (!validateForm()) return;

    try {
      await dispatch(registration({ email: formData.email, password: formData.password }));
      if(error) {
        setFormData({
          email: '',
          password: '',
        });
      }
    } catch (e: any) {
      console.error('Error during registration:', e);
    }
  };


  const handleResend = async(e: React.MouseEvent<HTMLHeadingElement>) => {
    e.preventDefault();
    try {
       await dispatch(resendActivation({email: user.email}))
    } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setError());
    };
  }, [dispatch]);

  return (
    <>
      <div className="registration-form-container">
        {isAuth && !user?.isActivated && (
          <p className="activation-message">
            Вам відправлений лист. Перейдіть за посиланням та активуйте акаунт.
          </p>
        )}
        {
          isAuth && <h3 className='reset-link' onClick={handleResend}>Відправити лист активації повторно !!!</h3>
        }
        <h2 className="form-title">Реєстрація</h2>
        <input
          type="text"
          placeholder="Email"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="form-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button className="form-button" onClick={handleRegistration}>
          Зареєструватись
        </button>
        <p className="login-link-text">
          Уже маєте акаунт?{' '}
          <Link to="/login" className="login-link">
            Увійти
          </Link>
        </p>
        
        
        {frontError && <p className='error-style'>{frontError}</p>}
        {error && <p className='error-style'>{error.message}</p>}
      </div>

      {isLoading && (
        <div className="loader-container-registration">
          <Loading />
        </div>
      )}
    </>
  );
};

export default RegistrationForm;

