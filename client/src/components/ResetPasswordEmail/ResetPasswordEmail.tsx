import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { resetPaswordemail, setError } from '../../store/userSlice';
import { Link } from 'react-router-dom';
import '../Registration/RegistrationForm.css'; 
import Loading from '../Loading/Loading';

const ResetPasswordEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [frontError, setFrontError] = useState<string | null>(null); 
  const [formData, setFormData] = useState({
    email: ''
  });

  const error = useSelector((state: RootState) => state.user.error);
  const loading = useSelector((state: RootState) => state.user.isLoading);
  const user = useSelector((state: RootState) => state.user.user);

  
  const validateForm = () => {
    if (!formData.email) {
      setFrontError('Будь ласка, заповніть всі поля.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFrontError('Будь ласка, введіть коректний email.');
      return false;
    }
    setFrontError(null); 
    return true;
  };


  const handleRegistration = async (e: React.FormEvent) => {
       e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(resetPaswordemail({ email: formData.email }));
      if(error) {
        setFormData({ email: '' });
      }
    } catch (e: any) {
      console.log(e);
    }
  };
console.log(user)
  useEffect(() => {
    return () => {
      dispatch(setError());
    };
  }, [dispatch]);

  return (
    <>
      <div className="registration-form-container">
        {user.resetPasswordLink && (
          <p className="activation-message">
            Вам відправлений лист. Перейдіть за посиланням та скиньте пароль.
          </p>
        )}
        <h2 className="form-title">Введіть пошту</h2>
        
          <input
            type="text"
            placeholder="Email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button className="form-button" type="submit" onClick={handleRegistration}>
            Далі
          </button>
        {frontError && <p className='error-style'>{frontError}</p>}
        {error && <p className="error-style">{error.message}</p>}
        {loading && (
          <div className="loader-container-registration">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPasswordEmail;