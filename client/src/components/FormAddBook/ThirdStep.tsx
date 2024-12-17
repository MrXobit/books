import React, { useState } from 'react';
import styles from './styles/ThirdStep.module.css';


interface ThirdStepProps {
    handleThirdStep: (author: string, title: string) => void;
  }

const ThirdStep: React.FC<ThirdStepProps> = ({handleThirdStep}) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<null | string>(null);

  const handleSubmit = () => {
    if (author.trim() && title.trim()) {
      handleThirdStep(author, title)
    } else {
      setError('Заповніть всі поля')
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Додайте книгу</h2>

        <label className={styles.label} htmlFor="author">Автор:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={styles.input}
          placeholder="Введіть автора книги"
        />

        <label className={styles.label} htmlFor="title">Заголовок:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="Введіть заголовок книги"
        />
         {error && <p className={styles.error}>{error}</p>}
        <button className={styles.button} onClick={handleSubmit}>
          Додати книгу
        </button>
      </div>
    </div>
  );
};

export default ThirdStep;
