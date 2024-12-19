import React, { useEffect } from 'react'
import './App.css';
import LoginForm from './components/Login/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store/store';
import { checkAuth } from './store/userSlice';
import Router from './components/Router';


const App = () => {

  const dispatch = useDispatch<AppDispatch>()


  useEffect(() => {
    if(localStorage.getItem('token')) {
      dispatch(checkAuth()); 
    }
  }, [])  
  return (
    <div>
       <Router/>
    </div>
  )
}

export default App;
