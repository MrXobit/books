import React from 'react';
import './NotFoundPage.css';
import { Link } from 'react-router-dom';
const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-message">Сторінку не знайдено</p>
      <p className="notfound-description">
        На жаль, запитана сторінка не існує. Можливо, ви ввели неправильну адресу або сторінка була видалена.
      </p>
      <Link to="/" className="notfound-link">Повернутися на головну</Link>
    </div>
  );
};

export default NotFoundPage;
