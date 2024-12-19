import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import bookReducer from './bookSlice';
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    user: userReducer, 
    book: bookReducer
  },
});

export default store;
