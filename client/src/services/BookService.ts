import $api from "../http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";

import { Book } from "../models/response/BookDto";
import { ObjectId } from "mongodb";


export default class BookService {
    static async addBook(file: File, image: File, title: string, author: string): Promise<AxiosResponse<Book>> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('image', image);
        formData.append('title', title);  
        formData.append('author', author);  
        return $api.post<Book>('/addbook', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }


    static async getBooks(userId: ObjectId,count: number = 10, offset: number = 0): Promise<AxiosResponse<Book[]>> {
        return $api.get<Book[]>('/userbooks', {
            params: {
                userId,
                count,  
                offset,  
            }
        });
    }
    

    static async getOneBook(id: string): Promise<AxiosResponse<Book>> {
        return $api.get<Book>(`/getonebook/${id}`);
    }


    static async delete(id: string): Promise<AxiosResponse<null>> {
        return $api.delete<null>(`deletebook`, {
            params: {
                id: id
            }
        });
    }

}