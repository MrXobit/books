import { AxiosResponse } from 'axios'; // Імпортуємо без axios простору імен
import { IUser } from "../models/response/IUser";
import $api from "../http";  // Імпортуємо ваш інстанс API
import { ObjectId } from 'mongodb';
import { resetDto } from '../models/response/ResetToken';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/users');
  }

  static async updateLogo(id: ObjectId, newUserLogo: File): Promise<AxiosResponse<string>> {
    const formData = new FormData();
    formData.append('newUserLogo', newUserLogo); 
    return $api.post<string>(`/changeLogo?id=${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      }
    });
  }


  static async resetPaswordemail (email: string): Promise<AxiosResponse<resetDto>> {
    return $api.post<resetDto> ('resetpasswordemail', {email})
  }

  static async resetPasswordFinal(password: string, email: string): Promise<AxiosResponse<IUser>> {
    return $api.post<IUser>('resetpasswordfinal', {password, email})
  }

  static async resetRefresh(): Promise<AxiosResponse<resetDto>> {
    return $api.get<resetDto>('refreshReset')
  }

  static async resendActivation(email: string): Promise<AxiosResponse<void>> {
    return $api.post<void>('resend-activation', {email})
  }
  
}
