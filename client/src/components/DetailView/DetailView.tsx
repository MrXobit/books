// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom'; 
// import BookService from '../../services/BookService';
// import { Book } from '../../models/response/BookDto';
// import * as pdfjsLib from 'pdfjs-dist';
// import './DetailView.css';
// import axios from 'axios';
// import { BOOKS_ROUTE } from '../../utils/consts';
// import { Link } from 'react-router-dom';
// const DetailView = () => {
//   const navigate = useNavigate()
//   const { id } = useParams()
//   const [book, setBook] = useState<Book | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pdfText, setPdfText] = useState<string>('');
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [translate, setTranslate] = useState<string | null>(null);
//   const [sourceLanguage] = useState('en');
//   const [targetLanguage] = useState('uk'); 

 
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


//   const fetchBookDetails = async (id: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await BookService.getOneBook(id);
//       setBook(response.data); 
//     } catch (e) {
//       console.error('Помилка при отриманні книги:', e);
//       setError('Не вдалося завантажити книгу. Спробуйте ще раз пізніше.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const extractPdfText = async (url: string) => {
//     try {
//       const loadingTask = pdfjsLib.getDocument(url);
//       const pdf = await loadingTask.promise;
//       let text = '';

//       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const content = await page.getTextContent();
//         const pageText = content.items.map((item: any) => item.str).join(' ');
//         text += pageText + '\n\n';
//       }
//       setPdfText(text); 
//     } catch (e) {
//       console.error('Помилка при витягуванні тексту з PDF:', e);
//       setError('Не вдалося витягнути текст з книги.');
//     }
//   };

  
//   useEffect(() => {
//     if (id) {
//       fetchBookDetails(id);
//     } else {
//       setError('Ідентифікатор книги відсутній');
//     }
//   }, [id]);


//   useEffect(() => {
//     if (book && book.book) {
//       const pdfUrl = `http://localhost:5000/static/books/${book.book}`;
//       extractPdfText(pdfUrl);
//     } else {
//       setError('Не вдалося знайти PDF файл книги.');
//     }
//   }, [book]);

//   const getCurrentPageText = () => {
//     const words = pdfText.split(/\s+/); 
//     const wordsPerPage = 2000; 
//     const startIdx = (currentPage - 1) * wordsPerPage;
//     const endIdx = currentPage * wordsPerPage;
//     const pageText = words.slice(startIdx, endIdx).join(' ');

 
//     const wordElements = pageText.split(/\s+/).map((word, index) => (
//       <span
//         key={index}
//         className="clickable-word"
//         onClick={() => handleWordClick(word)}
//         style={{ cursor: 'pointer', color: '#3498db' }} 
//       >
//         {word}{' '}
//       </span>
//     ));

//     return wordElements;
//   };


//   const generatePageNumbers = () => {
//     const totalWords = pdfText.split(/\s+/).length;
//     const wordsPerPage = 2000; 
//     const totalPages = Math.ceil(totalWords / wordsPerPage);
//     const pageNumbers = [];
//     const maxVisiblePages = 9;
//     const halfVisible = Math.floor(maxVisiblePages / 2);

//     let start = Math.max(currentPage - halfVisible, 1);
//     let end = Math.min(currentPage + halfVisible, totalPages);


//     if (end - start + 1 < maxVisiblePages) {
//       if (start === 1) {
//         end = Math.min(start + maxVisiblePages - 1, totalPages);
//       } else if (end === totalPages) {
//         start = Math.max(end - maxVisiblePages + 1, 1);
//       }
//     }

//     for (let i = start; i <= end; i++) {
//       pageNumbers.push(i);
//     }


//     if (!pageNumbers.includes(totalPages)) {
//       pageNumbers.push(totalPages);
//     }

//     return pageNumbers;
//   };


//   const handleWordClick = async (text: string) => {
//     const apiUrl = `https://lingva.ml/api/v1/${sourceLanguage}/${targetLanguage}/${encodeURIComponent(text)}`;
//     try {
//       const response = await axios.get(apiUrl);
//       setTranslate(response.data.translation);
//     } catch (error) {
//       console.error('Translation API error:', error);
//       setTranslate('Не вдалося перекласти слово.');
//     }
//   };

//   const handleExit = () => {
//     navigate(BOOKS_ROUTE)
//   }
 

//   return (
//     <div className="detail-view-container">
//       {loading && <div>Завантаження...</div>}

//       {book && (

//         <div className="book-detail">
//             <div className="roll">
//                 <div className="">
//                     <h1>{book.title}</h1>
//                     <p>Автор: {book.author}</p>
//                 </div>
// <button className="logout-button" onClick={handleExit}>
//                 Вийти
//             </button>
//         </div>
//           <div className="pdf-text-container">
//             <pre className="preformatted-text">{getCurrentPageText()}</pre> 
//           </div>

         
//           {translate && (
//             <div className="translation-block">
//               <h3>Переклад:</h3>
//               <p>{translate}</p>
//             </div>
//           )}

       
       
       
       
//           <div className="pagination">
//             <span className="page-numbers">
//               {generatePageNumbers().map((pageNum) => (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={currentPage === pageNum ? 'active' : ''}
//                 >
//                   {pageNum}
//                 </button>
//               ))}
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailView;




import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { getOneBook } from '../../store/bookSlice'; // імпортуємо екшн
import * as pdfjsLib from 'pdfjs-dist';
import './DetailView.css';
import axios from 'axios';
import { BOOKS_ROUTE } from '../../utils/consts';
import { ObjectId } from 'mongodb'; // імпортуємо ObjectId
import { Book } from '../../models/response/BookDto'; // імпортуємо тип Book
import { AppDispatch } from '../../store/store';

const DetailView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  
  const book = useSelector((state: any) => state.book.curentBook);
  const loading = useSelector((state: any) => state.book.isLoading); 
  const [pdfText, setPdfText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [translate, setTranslate] = useState<string | null>(null);
  const [sourceLanguage] = useState('en');
  const [targetLanguage] = useState('uk');

  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

 
  useEffect(() => {
    if (id) {
      dispatch(getOneBook(id));
    }
  }, [id, dispatch]);

  const extractPdfText = async (url: string) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      let text = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        text += pageText + '\n\n';
      }
      setPdfText(text);
    } catch (e) {
      console.error('Помилка при витягуванні тексту з PDF:', e);
    }
  };

  useEffect(() => {
    if (book && book.book) {
      const pdfUrl = `http://localhost:5000/static/books/${book.book}`;
      extractPdfText(pdfUrl);
    } else {
      console.error('Не вдалося знайти PDF файл книги.');
    }
  }, [book]);

  const getCurrentPageText = () => {
    const words = pdfText.split(/\s+/);
    const wordsPerPage = 2000;
    const startIdx = (currentPage - 1) * wordsPerPage;
    const endIdx = currentPage * wordsPerPage;
    const pageText = words.slice(startIdx, endIdx).join(' ');

    return pageText.split(/\s+/).map((word, index) => (
      <span
        key={index}
        className="clickable-word"
        onClick={() => handleWordClick(word)}
        style={{ cursor: 'pointer', color: '#3498db' }}
      >
        {word}{' '}
      </span>
    ));
  };

  const generatePageNumbers = () => {
    const totalWords = pdfText.split(/\s+/).length;
    const wordsPerPage = 2000;
    const totalPages = Math.ceil(totalWords / wordsPerPage);
    const pageNumbers = [];
    const maxVisiblePages = 9;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(currentPage + halfVisible, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(start + maxVisiblePages - 1, totalPages);
      } else if (end === totalPages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (!pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleWordClick = async (text: string) => {
    const apiUrl = `https://lingva.ml/api/v1/${sourceLanguage}/${targetLanguage}/${encodeURIComponent(text)}`;
    try {
      const response = await axios.get(apiUrl);
      setTranslate(response.data.translation);
    } catch (error) {
      console.error('Translation API error:', error);
      setTranslate('Не вдалося перекласти слово.');
    }
  };

  const handleExit = () => {
    navigate(BOOKS_ROUTE);
  };

  return (
    <div className="detail-view-container">
      {loading && <div>Завантаження...</div>}

      {book && (
        <div className="book-detail">
          <div className="roll">
            <div>
              <h1>{book.title}</h1>
              <p>Автор: {book.author}</p>
            </div>
            <button className="logout-button" onClick={handleExit}>
              Вийти
            </button>
          </div>

          <div className="pdf-text-container">
            <pre className="preformatted-text">{getCurrentPageText()}</pre>
          </div>

          {translate && (
            <div className="translation-block">
              <h3>Переклад:</h3>
              <p>{translate}</p>
            </div>
          )}

          <div className="pagination">
            <span className="page-numbers">
              {generatePageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? 'active' : ''}
                >
                  {pageNum}
                </button>
              ))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailView;
