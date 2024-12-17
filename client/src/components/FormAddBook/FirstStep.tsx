import React, { useState } from 'react';
import styles from './styles/FirstStep.module.css';

interface FirstStepProps {
    handleFirstStep: (file: File | null) => void;
  }

const FirstStep: React.FC<FirstStepProps> = ({handleFirstStep}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [nameFile, setNameFile] = useState<string>('')
  const supportedExtensions = ['txt', 'pdf', 'epub', 'mobi'];

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
      } else {
        setError('Розширення не підтримується');
        setFile(null)
        setNameFile(droppedFile.name)
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
      } else {
        setError('Розширення не підтримується');
        setNameFile(selectedFile.name)
        setFile(null)
      }
    }
  };

  const handleNext = (e: any) => {
    if(file) {
        handleFirstStep(file)
    } else {
        setError('Виберіть файл')
    }
  }

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
        
        <p className={styles.formatsText} style={{ marginTop: '15px' }}>
          Завантажте книгу у форматі 'txt', 'pdf', 'epub', 'mobi'.
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

export default FirstStep;
