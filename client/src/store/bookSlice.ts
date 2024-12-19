import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../models/response/BookDto";
import { ObjectId } from "mongodb";
import BookService from "../services/BookService";


interface BookState {
    curentBook: Book | null;
    books: Book[];
    isLoading: boolean;
}

const initialState: BookState = {
    curentBook: null,
    books: [],
    isLoading: false
}

export const getbooks = createAsyncThunk(
    'book/getbooks',
    async ({userId, count=10, offset = 0}: 
{userId: ObjectId, count?: number, offset?: number}) => {
       const response = await BookService.getBooks(userId, count, offset);
       return response.data
    }
)

export const getOneBook = createAsyncThunk(
    'book/getOneBook', 
    async (id: string) => { 
      const response = await BookService.getOneBook(id); 
      return response.data;
    }
  );

export const addBook = createAsyncThunk(
    'book/addbook',
    async({file, image, title, author}: 
        {file: File, image: File, title: string, author: string}) => {
     const response = await BookService.addBook(file, image, title, author)
     return response
    }
)

export const deletebook = createAsyncThunk (
    'book/deletebook',
    async (id: string) => {
      const response = await BookService.delete(id)
    }
)

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },

        setBooks(state, action: PayloadAction<Book[]>) {
            state.books = action.payload
        },

        setCurentBook(state, action: PayloadAction<Book>) {
            state.curentBook = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getOneBook.fulfilled, (state, action) => {
            state.curentBook = action.payload
            state.isLoading = false
        })

        .addCase(getbooks.fulfilled, (state, action) => {
            state.books = action.payload
            state.isLoading = false
        })

        .addCase(addBook.fulfilled, (state, action) => {
            state.books.push(action.payload.data); 
            state.isLoading = false;
        })


        .addCase(getOneBook.pending, (state) => {
            state.isLoading =  true
        })

        .addCase(getbooks.pending, (state) => {
            state.isLoading =  true
        })

        .addCase(addBook.pending, (state) => {
            state.isLoading =  true
        })


        .addCase(getOneBook.rejected, (state) => {
            state.isLoading =  false
        })

        .addCase(getbooks.rejected, (state) => {
            state.isLoading =  false
        })

        .addCase(addBook.rejected, (state) => {
            state.isLoading =  false
        })

        .addCase(deletebook.rejected, (state) => {
            state.isLoading =  false
        })

        .addCase(deletebook.pending, (state) => {
            state.isLoading =  true
        })

        .addCase(deletebook.fulfilled, (state) => {
            state.isLoading = false
        })


        
    }
})

export const { setLoading, setBooks, setCurentBook } = bookSlice.actions;

export default bookSlice.reducer;
