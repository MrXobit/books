import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { registration, resetPasswordFinal, resetRefresh, setError, setLoading } from '../../store/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../Registration/RegistrationForm.css'; 
import Loading from '../Loading/Loading';
import { LOGIN_ROUTE, MAIN_ROUTE } from '../../utils/consts';


const ResetPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    second: '',
    password: '',
  });

  const error = useSelector((state: RootState) => state.user.error);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password.trim() !== formData.second.trim()) {
      return;
    }
  
    try {
      await dispatch(resetPasswordFinal({ password: formData.password, email: user.email }));
      setFormData({ second: '', password: '' });
      navigate(LOGIN_ROUTE);
    } catch (error) {
      console.error('Помилка під час скидання пароля:', error);
    }
  };
  

  const user = useSelector((state: RootState) => state.user.user);
  const { isLoading } = useSelector((state: RootState) => state.user);
  
 useEffect(() => {
   dispatch(resetRefresh())
   return () => {
    dispatch(setError()); 
  };
 }, [])

 

  return (

    
    <>
    <div className="registration-form-container">
      <h2 className="form-title">Скинути пароль</h2>
      <input
        type="text"
        placeholder="password"
        className="form-input"
        value={formData.second}
        onChange={(e) => setFormData({ ...formData, second: e.target.value })}
      />
      <input
        type="reset-password"
        placeholder="password"
        className="form-input"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button className="form-button" onClick={handleRegistration}>
        Скинути пароль
      </button>
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

export default ResetPassword;

