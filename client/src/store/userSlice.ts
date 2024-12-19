import { createSlice, createAsyncThunk, PayloadAction, SerializedError } from '@reduxjs/toolkit';

import AuthService from "../services/AuthService";
import axios, { AxiosError } from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import { IUser } from '../models/response/IUser';
import { ObjectId } from 'mongodb';
import UserService from '../services/UserService';
import { resetDto } from '../models/response/ResetToken';


export interface ApiErrorInterface {
  status: number;
  message: string;
  errors: any[];
}



interface UserState {
  user: IUser;
  isAuth: boolean;
  isLoading: boolean;
  userLogo: null | string;
  error: null | ApiErrorInterface
}

const initialState: UserState = {
  user: {} as IUser,
  isAuth: false,
  isLoading: false,
  userLogo: null,
  error: null
};

export const login = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: ApiErrorInterface }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('token', response.data.accessToken);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue({
            status: error.response.status,
            message: error.response.data.message || 'Error during login',
            errors: error.response.data.errors || []
          });
        }
      }
      return rejectWithValue({
        status: 503,
        message: 'Network error or server unavailable',
        errors: []
      });
    }
  }
);



export const updateLogo = createAsyncThunk(
  'auth/updateLogo',
  async ({ id, file }: { id: ObjectId; file: File }) => {
     const response = await UserService.updateLogo(id, file)
     console.log(response.data)
     return response.data
  }
)

export const registration = createAsyncThunk<
  AuthResponse, 
  { email: string; password: string }, 
  { rejectValue: ApiErrorInterface }
>(
  'auth/registration',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthService.registration(email, password);
      localStorage.setItem('token', response.data.accessToken);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue({
            status: error.response.status,
            message: error.response.data.message || 'Error during registration',
            errors: error.response.data.errors || []
          });
        } else {
          return rejectWithValue({
            status: 503,
            message: 'Network error or server unavailable',
            errors: []
          });
        }
      }
      return rejectWithValue({
        status: 500,
        message: 'An unexpected error occurred',
        errors: []
      });
    }
  }
);


export const logout = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout();
  localStorage.removeItem('token');
  return {};
});


export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
    console.log(response.data);
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }
);

export const resetPaswordemail = createAsyncThunk<
  resetDto,
  { email: string },
  { rejectValue: ApiErrorInterface }
>(
  'auth/resetPaswordemail',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await UserService.resetPaswordemail(email);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue({
            status: error.response.status,
            message: error.response.data.message || 'Error during reset password',
            errors: error.response.data.errors || [],
          });
        }
      }
      return rejectWithValue({
        status: 503,
        message: 'Network error or server unavailable',
        errors: [],
      });
    }
  }
);

export const resetPasswordFinal = createAsyncThunk<
  IUser,
  { password: string, email: string }, 
  { rejectValue: ApiErrorInterface } 
>(
  'auth/resetPasswordFinal',
  async ({ password, email }, { rejectWithValue }) => {
    try {
      const response = await UserService.resetPasswordFinal(password, email);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          return rejectWithValue({
            status: error.response.status,
            message: error.response.data.message || 'Error during reset password',
            errors: error.response.data.errors || [],
          });
        }
      }
      return rejectWithValue({
        status: 503, 
        message: 'Network error or server unavailable', 
        errors: [],
      });
    }
  }
);

export const resetRefresh = createAsyncThunk (
  'auth/resetToken',
  async() => {
    const response = await UserService.resetRefresh()
    console.log(response.data)
    return response.data
  }
)



export const resendActivation = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: ApiErrorInterface }
>(
  'auth/resendActivation',
  async ({ email }, { rejectWithValue }) => {
    try {
    await UserService.resendActivation(email);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data?.message || 'Error during resend activation',
          errors: error.response.data?.errors || [],
        });
      }
      return rejectWithValue({
        status: 503,
        message: 'Network error or server unavailable',
        errors: [],
      });
    }
  }
);







const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<void>) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.error = null
        localStorage.setItem('token', action.payload.accessToken);
        state.isAuth = true;
        state.user = action.payload.userDto;
        state.isLoading = false
        state.userLogo = action.payload.userDto.logo;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.error = null
        localStorage.setItem('token', action.payload.accessToken);
        state.isAuth = true;
        state.user = action.payload.userDto;
        state.isLoading = false
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem('token');
        state.isAuth = false;
        state.user = {} as IUser;
        state.isLoading = false
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        localStorage.setItem('token', action.payload.accessToken);
        state.isAuth = true;
        state.user = action.payload.userDto;
        state.userLogo = action.payload.userDto.logo;
        state.isLoading = false;
 
      })

      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        if(action.payload) {
          state.error = action.payload
        }
        state.user = {} as IUser;
        state.isAuth = false
        state.isLoading = false;
      })
      .addCase(registration.rejected, (state, action) => {
        console.log(action.payload?.message)
        if (action.payload) {
          state.error = action.payload; 
        }
        state.user = {} as IUser;
        state.isAuth = false
        state.isLoading = false;
      })


      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registration.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })


      .addCase(updateLogo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateLogo.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateLogo.fulfilled, (state, action) => {
        state.userLogo = action.payload
        state.isLoading = false;
      })


      .addCase(resetPaswordemail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPaswordemail.rejected, (state, action) => {
        if(action.payload) {
          state.error = action.payload
        }
        state.user = {} as IUser;
        state.isLoading = false;
      })
      .addCase(resetPaswordemail.fulfilled, (state, action) => {
        state.error = null
        if (action.payload.userDto) {
          state.user = action.payload.userDto; 
        }
        state.isLoading = false;
      })



      .addCase(resetPasswordFinal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordFinal.rejected, (state, action) => {
        if(action.payload) {
          state.error = action.payload
        }
        state.user = {} as IUser;
        state.isLoading = false;
      })
      .addCase(resetPasswordFinal.fulfilled, (state, action) => {
        state.error = null
        state.user = action.payload
        state.isLoading = false;
      })


      .addCase(resetRefresh.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetRefresh.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(resetRefresh.fulfilled, (state, action) => {
        state.user = action.payload.userDto
        state.isLoading = false;
      })

      .addCase(resendActivation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resendActivation.rejected, (state, action) => {
        if(action.payload) {
          state.error = action.payload
        }
        state.isLoading = false;
      })
      .addCase(resendActivation.fulfilled, (state, action) => {
        state.isLoading = false;
      })


 


  },
});

export const { setAuth, setUser, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;


