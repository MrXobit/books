import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { login, setError } from '../../store/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';
import Loading from '../Loading/Loading';
import { BOOKS_ROUTE, RESET_PASSWORD_EMAIL_ROUTE } from '../../utils/consts';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [frontError, setFrontError] = useState<string | null>(null); 
  const error = useSelector((state: RootState) => state.user.error);
  const { isLoading } = useSelector((state: RootState) => state.user);

  const user = useSelector((state: RootState) => state.user.user);
  console.log(user);


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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(login({ email: formData.email, password: formData.password })).unwrap();
      if(error) {
        setFormData({
          email: '',
          password: '',
        });
        navigate(BOOKS_ROUTE);
      }
    } catch (err: any) {
      console.log(e)
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setError());
    };
  }, []);

  return (
    <>
      <div className="login-form-container">
        <h2 className="login-form-title">Логін</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            className="login-form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="login-form-input"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit" className="login-form-button">
            Увійти
          </button>
        </form>
        <p className="register-link-text">
          Немає акаунту?{' '}
          <Link to="/register" className="register-link">
            Зареєструватись
          </Link>
        </p>
        <p className="register-link-text">
          Забули пароль?{' '}
          <Link to={RESET_PASSWORD_EMAIL_ROUTE} className="register-link">
            Скинути пароль
          </Link>
        </p>
        {frontError && <p className='error-style'>{frontError}</p>}
        {error && <p className='error-style'>{error.message}</p>}
      </div>

      {isLoading && (
        <div className="loader-container-login">
          <Loading />
        </div>
      )}
    </>
  );
};

export default LoginForm;
