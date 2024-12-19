import React, { useEffect, useState } from 'react';
import './Books.css';
import { Link, useNavigate } from 'react-router-dom';
import { ADDBOOK_ROUTE, CHANGEUSERLOGO_ROUTE, MAIN_ROUTE } from '../../utils/consts';
import { Book } from '../../models/response/BookDto';
import BookService from '../../services/BookService';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { logout, updateLogo } from '../../store/userSlice';
import { deletebook, getbooks } from '../../store/bookSlice';
import { ObjectId } from 'mongodb';
const userPng = require('./user.png');
const closePng = require('./close.png');

const Books = () => {
  const books = useSelector((state: RootState) => state.book.books);
  const { isLoading } = useSelector((state: RootState) => state.book);
  const [bookModal, setBookModal] = useState<string | null>(null); 
  const { user } = useSelector((state: RootState) => state.user);
  const logo = useSelector((state: RootState) => state.user.userLogo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const getAllBooks = async () => {
    dispatch(getbooks({ userId: user._id, count: 10, offset: 0 }));
  };
  
 


  const handleModalLogo = (bookId: string) => {
    if (bookModal === bookId) {
      setBookModal(null); 
    } else {
      setBookModal(bookId); 
    }
  };

  useEffect(() => {
    getAllBooks();
  }, [dispatch, user._id]);

  const handleLogout = () => {
    dispatch(logout());
    navigate(MAIN_ROUTE);
  };

  const hancleDeleteBook = async (id: string) => {
    await dispatch(deletebook(id))
    await getAllBooks();
    setBookModal(null)
  }

  return (
    <div className="books-container">
      <div className={`modal-window ${isModalOpen ? 'open' : ''}`}>
        <img src={closePng} onClick={toggleModal} alt="" className="close-modal" />
        <div className="you-logo">
          <div className="you-logo-text">Ваше лого</div>
          <img src={logo ? `http://localhost:5000/static/logo/${logo}` : userPng} alt="User Logo" />
        </div>
        <Link to={CHANGEUSERLOGO_ROUTE} style={{ textDecoration: 'none' }}>
          <button className="logo-changer">Змінити лого</button>
        </Link>
        <div className="you-logo-block">
          <div className="you-email">ваша пошта</div>
          <div className="you-email">{user.email}</div>
        </div>
        <div className="btn-con"><button className="btn-logout" onClick={handleLogout}>Logout</button></div>
      </div>

      <div className="header-line">
        <h1>Better Books</h1>
        <img
          src={logo ? `http://localhost:5000/static/logo/${logo}` : userPng}
          alt="User Logo"
          className="logo-clickable"
          onClick={toggleModal}
        />
      </div>

      <div className="add-book-block">
        <Link to={ADDBOOK_ROUTE}>
          <div className="plus-container">
            <span className="plus-sign">+</span>
          </div>
        </Link>
        <p className="add-book-text">Додати нову книгу</p>
      </div>

      {isLoading && <Loading />}

      <div className="books-con">
        {books.map((book) => (
          <div key={book._id}>
            {bookModal === book._id && (
              <div className="modal-delete">
                <div className="modal-delete-content">
                  <button onClick={() => hancleDeleteBook(book._id)}>Видалити</button>
                  <div onClick={() => setBookModal(null)}>
                    <img src={closePng} alt="" />
                  </div>
                </div>
              </div>
            )}
            <div className="book-card">
              <div className="dots-container" onClick={() => handleModalLogo(book._id)}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <Link key={book._id} to={`/detail/${book._id}`} className="book-link">
                <img
                  src={`http://localhost:5000/static/logobooks/${book.image}`}
                  alt={book.title}
                  className="book-cover"
                />
              </Link>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
