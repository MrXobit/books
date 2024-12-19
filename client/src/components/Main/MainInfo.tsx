import React, { useEffect } from 'react';
import './MainInfo.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { BOOKS_ROUTE } from '../../utils/consts';
const MainInfo = () => {
  const navigate = useNavigate()
  const { isAuth } = useSelector((state: RootState) => state.user);
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    if(isAuth && user.isActivated) {
       navigate(BOOKS_ROUTE)
    }
  }, [])

  return (
    <div className="main-info">
      <div className="content">
        <h1 className="title">Welcome to Your Favorite Books</h1>
        <p className="description">
          Here, you can read your favorite books with instant translation. Whether you are learning a new language or just enjoy reading in different languages, our platform offers you the convenience of having translations at your fingertips.
        </p>
        <p className="instructions">
          To get started, please <Link to='/register' className="highlight">register</Link> or <Link to='/login' className="highlight">log in</Link>to access the full range of features and start exploring a world of books in various languages.
        </p>
        <Link to='/register'><button className="cta-button">Get Started</button></Link>
      </div>
    </div>
  );
};

export default MainInfo;
