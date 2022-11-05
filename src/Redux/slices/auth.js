import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axiosSettings'

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async params => {
	const { data } = await axios().post('/login', params)
	return data
})

export const fetchToken = createAsyncThunk('auth/fetchToken', async params => {
	try {
		const { data } = await axios().post('/token', params)
		return data
	} catch (err) {
		console.log(err)
	}
})

const initialState = {
	token: localStorage.getItem('token'),
	isFirstRender: true,
	id: '',
	name: '',
	avatar: '',
	isAuth: false,
	isAdmin: false,
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
		},
		loaded(state) {
			state.isFirstRender = false
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
			if (action.payload) {
				state.id = action.payload.id
				state.isFirstRender = false
				state.name = action.payload.name
				state.avatar = action.payload.avatar
				state.isAuth = true
				state.isAdmin = action.payload.isAdmin
			} else {
				state.id = ''
				state.isFirstRender = false
				state.name = ''
				state.avatar = ''
				state.isAuth = false
				state.isAdmin = false
				localStorage.removeItem('token')
			}
		},
		[fetchToken.rejected]: state => {
			state.id = ''
			state.isFirstRender = false
			state.name = ''
			state.avatar = ''
			state.isAuth = false
			state.isAdmin = false
		},
	},
})

export const { logout, registration, loaded } = authSlice.actions
export const authReducer = authSlice.reducer
