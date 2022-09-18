import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axiosSettings'

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async params => {
	const { data } = await axios().post('/login', params)
	return data
})

export const fetchToken = createAsyncThunk('auth/fetchToken', async params => {
	const { data } = await axios().post('/token', params)
	return data
})

const initialState = {
	token: localStorage.getItem('token'),
	id: '',
	name: '',
  avatar: '',
	isAuth: false,
	isAdmin: false
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
    logout(state) {
      state.token = ''
      localStorage.removeItem('token')
      state.id = ''
      state.name = ''
      state.avatar = ''
      state.isAuth = false
      state.isAdmin = false
    },
    registration(state, action) {
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      state.id = action.payload.id
      state.name = action.payload.name
      state.avatar = action.payload.avatar
      state.isAdmin = action.payload.isAdmin
      state.isAuth = true
    }
  },
  extraReducers: {
    // Авторизация
    [fetchLogin.pending]: state => {
      state.token = ''
      state.id = ''
      state.name = ''
      state.avatar = ''
      state.isAuth = false
      state.isAdmin = false
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.token = action.payload.token
      localStorage.setItem('token', action.payload.token)
      state.id = ''
      state.name = ''
      state.avatar = action.payload.avatar
      state.isAuth = false
      state.isAdmin = false
    },
    [fetchLogin.rejected]: state => {
      state.token = ''
      state.id = ''
      state.name = ''
      state.avatar = ''
      state.isAuth = false
      state.isAdmin = false
    },
    // Расшифровка токена
    [fetchToken.pending]: state => {
      state.id = ''
      state.name = ''
      state.avatar = ''
      state.isAuth = false
      state.isAdmin = false
    },
    [fetchToken.fulfilled]: (state, action) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.avatar = action.payload.avatar
      state.isAuth = true
      state.isAdmin = action.payload.isAdmin
    },
    [fetchToken.rejected]: state => {
      state.id = ''
      state.name = ''
      state.avatar = ''
      state.isAuth = false
      state.isAdmin = false
    },
  }
})

export const { logout, registration } = authSlice.actions
export const authReducer = authSlice.reducer
