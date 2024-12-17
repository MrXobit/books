import React, { useState } from 'react'
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import BookService from '../../services/BookService';
import { useNavigate } from 'react-router-dom';
import { BOOKS_ROUTE } from '../../utils/consts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { addBook } from '../../store/bookSlice';


const FormAddBook = () => {
const navigate = useNavigate()
const dispatch = useDispatch<AppDispatch>();
  interface FormData {
    book: File | null;
    image: File | null;
    author: string;
    title: string;
  }
  
 
  interface Step {
    first: boolean;
    second: boolean;
    third: boolean;
  }
    const [formData, setFormData] = useState<FormData>({
        book: null,
        image: null,
        author: '',
        title: ''
      });

      const [step, setStep] = useState<Step>({
        first: true,
        second: false,
        third: false,
      })

      const handleFirstStep = (file: File | null) => {
        setFormData({...formData, book: file})
        setStep({
          first: false,
          second: true,
          third: false,
        })
        console.log(formData)
      }

      const handleSecondtStep = (file: File | null) => {
        setFormData({...formData, image: file})
        setStep({
          first: false,
          second: false,
          third: true,
        })
        console.log(formData)
      }


      // const handleThirdStep = (author: string,title: string) => {
      //   const updatedFormData = { ...formData, author, title };
      //     if(!updatedFormData.book || !updatedFormData.image) {
      //       console.error("Файл книги або зображення не обрано");
      //       return;
      //     }
        
      //     setFormData(updatedFormData);
      //     console.log(updatedFormData)
      //     BookService.addBook(
      //       updatedFormData.book,
      //       updatedFormData.image,
      //       updatedFormData.title,
      //       updatedFormData.author
      //     )
      //     navigate(BOOKS_ROUTE)
      // }


      const handleThirdStep = (author: string,title: string) => {
        const updatedFormData = { ...formData, author, title };
          if(!updatedFormData.book || !updatedFormData.image) {
            console.error("Файл книги або зображення не обрано");
            return;
          }
        
          setFormData(updatedFormData);
          console.log(updatedFormData)
          dispatch(addBook({
            file: updatedFormData.book,   
            image: updatedFormData.image, 
            title: updatedFormData.title, 
            author: updatedFormData.author 
        }));
          navigate(BOOKS_ROUTE)
      }
   
      
  return (
    <div>
  {step.first && <FirstStep handleFirstStep={handleFirstStep} />}
  {step.second && <SecondStep handleSecondtStep={handleSecondtStep}/>}
  {step.third && <ThirdStep handleThirdStep={handleThirdStep}/>}
    </div>
  )
}

export default FormAddBook