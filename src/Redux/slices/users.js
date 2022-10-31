import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from '../../axiosSettings'

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
	const { data } = await axios().get('/users')
	return data
})

const initialState = {
	users: [],
	allUsers: [],
	data: [],
	groupCounter: [],
	me: {},
	isLoading: true,
}

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		update(state, action) {
			state.users = action.payload.users.filter(user => user.active)
			state.allUsers = action.payload.users
			state.data = action.payload.data
			state.groupCounter = action.payload.groupCounter
			state.me = action.payload.me
		},
	},
	extraReducers: {
		[fetchUsers.pending]: state => {
			state.users = []
			state.allUsers = []
			state.data = []
			state.groupCounter = []
			state.me = {}
			state.isLoading = true
		},
		[fetchUsers.fulfilled]: (state, action) => {
			state.users = action.payload.users.filter(user => user.active)
			state.allUsers = action.payload.users
			state.data = action.payload.data.filter(user => user.active)
			state.groupCounter = action.payload.groupCounter
			state.me = action.payload.me
			state.isLoading = false
		},
		[fetchUsers.rejected]: state => {
			state.users = []
			state.allUsers = []
			state.data = []
			state.groupCounter = []
			state.me = {}
			state.isLoading = true
		},
	},
})

export const { update } = usersSlice.actions
export const usersReducer = usersSlice.reducer
