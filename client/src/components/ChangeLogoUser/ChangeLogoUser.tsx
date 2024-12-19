import React, { useState } from 'react';
import styles from '../FormAddBook/styles/FirstStep.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateLogo } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { BOOKS_ROUTE } from '../../utils/consts';



const ChangeLogoUser = () => {
  const navigate = useNavigate()  
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [nameFile, setNameFile] = useState<string>('')
  const [view, setView] = useState<string | null>(null)
  const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      const fileExtension = droppedFile.name.toLowerCase().split('.').pop();
      if (fileExtension && supportedExtensions.includes(fileExtension)) {
        setFile(droppedFile);
        setError(null);
        setNameFile(droppedFile.name)
        const imageUrl = URL.createObjectURL(droppedFile);
        setView(imageUrl);
      } else {
        setError('Розширення не підтримується');
        setFile(null)
        setNameFile(droppedFile.name)
        setView(null)
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.toLowerCase().split('.').pop();
      if (fileExtension && supportedExtensions.includes(fileExtension)) {
        setFile(selectedFile);
        setError(null); 
        setNameFile(selectedFile.name)
        const imageUrl = URL.createObjectURL(selectedFile);
        setView(imageUrl);
      } else {
        setView(null)
        setError('Розширення не підтримується');
        setNameFile(selectedFile.name)
        setFile(null)
      }
    }
  };

  const handleNext = async (e: any) => {
    if (file) {
      try {
        await dispatch(updateLogo({ id: user._id, file })).unwrap(); 
        navigate(BOOKS_ROUTE);
      } catch (error) {
        console.error('Помилка при оновленні логотипа:', error);
      }
    } else {
      setError('Виберіть файл');
    }
  };
  

  return (
    
    <div
    
      className={styles.container}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
   
      <div
        className={styles.card}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
              {view && (
      <div className={styles.imageContainer}>
        <img src={view} alt="Uploaded preview" className={styles.image} />
      </div>
    )}
        <p className={styles.title}>
          {nameFile ? `Файл: ${nameFile}` : 'Перетягніть файл або виберіть через кнопку'}
        </p>

       

        <label
          className={styles.label}
          htmlFor="file-input"
        >
          Виберіть файл
        </label>

        <input
          type="file"
          id="file-input"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <p className={styles.formatsText}>
          Завантажте книгу у форматі 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'.
        </p>

        <button
          className={styles.button}
          onClick={handleNext}
        >
          Продовжити
        </button>

        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  
  );
};

export default ChangeLogoUser;